"""
Hydrogen Pipeline Planner (Fast OSRM-based prototype)

Endpoints:
- POST /plan/by-names    -> body: {"source_name":"Ahmedabad, India","target_name":"Surat, India", "cost":{...}}
- POST /plan/by-coords   -> body: {"source":[lon,lat], "target":[lon,lat], "cost":{...}}
- GET  /health
- GET  /debug/version

Notes:
- Uses OSRM for fast routing (milliseconds instead of minutes)
- Uses OSM only for polygon data (residential/water areas)
- Returns GeoJSON LineString, distance_km, capex estimate
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import math
import requests
import osmnx as ox
import networkx as nx
from shapely.geometry import LineString, Point, Polygon
import geopandas as gpd
import shapely
import asyncio
import aiohttp
from datetime import datetime
import json

app = FastAPI(title="Hydrogen Pipeline Planner (Fast OSRM)")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OSMnx
ox.settings.log_console = False
ox.settings.use_cache = True
ox.settings.timeout = 30

# OSRM server (public instance or your own)
OSRM_BASE_URL = "http://router.project-osrm.org"

# ---------------------------
# Helpers
# ---------------------------
def haversine_km(coord1, coord2):
    lon1, lat1 = coord1
    lon2, lat2 = coord2
    R = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

async def get_osrm_route(source_coord, target_coord):
    """Get route from OSRM (fast routing)"""
    lon1, lat1 = source_coord
    lon2, lat2 = target_coord
    url = f"{OSRM_BASE_URL}/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url, timeout=30) as response:
            if response.status == 200:
                data = await response.json()
                return data
            else:
                raise HTTPException(status_code=500, detail="OSRM routing failed")

def calculate_route_cost(route_geometry, cost_params, residential_polys, water_polys):
    """Calculate cost based on route geometry and obstacles"""
    total_km = route_geometry.length / 1000  # Convert to km
    total_score = total_km  # Base score is distance
    
    # Check intersections with obstacles
    line = LineString(route_geometry)
    
    # Check residential areas
    residential_penalty = 0
    for poly in residential_polys:
        if line.intersects(poly):
            if cost_params.forbid_residential:
                residential_penalty += cost_params.residential_multiplier
            else:
                residential_penalty += 100.0
    
    # Check water bodies
    water_penalty = 1.0
    for poly in water_polys:
        if line.intersects(poly):
            water_penalty *= cost_params.water_multiplier
    
    total_score = total_km * water_penalty + residential_penalty
    
    # Calculate financials
    capex_by_km = total_km * cost_params.pipe_capex_per_km_inr
    capex_by_km *= cost_params.land_multiplier * (1 + cost_params.design_contingency_pct)
    annual_opex = capex_by_km * cost_params.opex_pct_per_year
    capex_by_score = total_score * cost_params.score_to_inr_unit
    
    return {
        "total_km": round(total_km, 3),
        "total_score": round(total_score, 3),
        "capex_by_km_inr": round(capex_by_km, 0),
        "capex_by_score_inr": round(capex_by_score, 0),
        "annual_opex_inr": round(annual_opex, 0),
        "has_residential": residential_penalty > 0,
        "has_water": water_penalty > 1.0
    }

async def get_obstacle_polygons(bbox):
    """Get residential and water polygons for the area"""
    residential_polys = []
    water_polys = []
    
    try:
        # Get polygons in parallel
        async with aiohttp.ClientSession() as session:
            tasks = []
            
            # Residential areas
            tasks.append(get_geometries_async(session, bbox, {"landuse": "residential"}))
            # Water bodies
            tasks.append(get_geometries_async(session, bbox, {"natural": "water"}))
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            if not isinstance(results[0], Exception):
                res_gdf = results[0]
                if res_gdf is not None and not res_gdf.empty:
                    for geom in res_gdf.geometry:
                        if geom and geom.geom_type in ("Polygon", "MultiPolygon"):
                            if geom.geom_type == "Polygon":
                                residential_polys.append(geom)
                            else:
                                residential_polys.extend(geom.geoms)
            
            if not isinstance(results[1], Exception):
                water_gdf = results[1]
                if water_gdf is not None and not water_gdf.empty:
                    for geom in water_gdf.geometry:
                        if geom and geom.geom_type in ("Polygon", "MultiPolygon", "LineString", "MultiLineString"):
                            if geom.geom_type == "Polygon":
                                water_polys.append(geom)
                            elif geom.geom_type == "MultiPolygon":
                                water_polys.extend(geom.geoms)
                            else:
                                water_polys.append(geom.buffer(0.001))
                                
    except Exception as e:
        print(f"Warning: Could not fetch polygons: {e}")
    
    return residential_polys, water_polys

async def get_geometries_async(session, bbox, tags):
    """Async function to get geometries from OSM"""
    try:
        gdf = ox.geometries_from_bbox(bbox, tags=tags)
        return gdf
    except Exception as e:
        print(f"Error fetching {tags}: {e}")
        return None

# ---------------------------
# Request models
# ---------------------------
class CostParams(BaseModel):
    pipe_capex_per_km_inr: float = 50_000_000.0
    land_multiplier: float = 1.15
    design_contingency_pct: float = 0.10
    opex_pct_per_year: float = 0.03
    forbid_residential: bool = True
    residential_multiplier: float = 1e9
    water_multiplier: float = 50.0
    score_to_inr_unit: float = 20_000_000.0

class PlanByNamesRequest(BaseModel):
    source_name: str
    target_name: str
    cost: CostParams = CostParams()

class PlanByCoordsRequest(BaseModel):
    source: List[float]   # [lon, lat]
    target: List[float]   # [lon, lat]
    cost: CostParams = CostParams()

# ---------------------------
# Core planning function
# ---------------------------
async def plan_pipeline_fast(src_lonlat, tgt_lonlat, cost_params: CostParams):
    """Fast pipeline planning using OSRM for routing"""
    
    # Get route from OSRM (fast)
    try:
        route_data = await get_osrm_route(src_lonlat, tgt_lonlat)
        
        if route_data.get("code") != "Ok":
            raise HTTPException(status_code=400, detail="No route found")
        
        route_geometry = route_data["routes"][0]["geometry"]
        coordinates = route_geometry["coordinates"]
        distance_meters = route_data["routes"][0]["distance"]
        
        # Create bbox around route for obstacle checking
        lons = [coord[0] for coord in coordinates]
        lats = [coord[1] for coord in coordinates]
        padding = 0.1  # ~11km buffer
        bbox = (
            max(lats) + padding,
            min(lats) - padding,
            max(lons) + padding,
            min(lons) - padding
        )
        
        # Get obstacles in parallel with routing
        residential_polys, water_polys = await get_obstacle_polygons(bbox)
        
        # Calculate costs
        line_string = LineString(coordinates)
        cost_summary = calculate_route_cost(line_string, cost_params, residential_polys, water_polys)
        
        # Prepare response
        line = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": coordinates
            },
            "properties": cost_summary
        }
        
        return {
            "line": line,
            "summary": cost_summary,
            "metadata": {
                "routing_engine": "OSRM",
                "processing_time_ms": route_data["routes"][0]["duration"] * 1000,
                "obstacles_checked": len(residential_polys) + len(water_polys)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Routing failed: {str(e)}")

# ---------------------------
# Endpoints
# ---------------------------
@app.get("/health")
async def health():
    return {
        "ok": True, 
        "msg": "Hydrogen pipeline planner (Fast OSRM) ready",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/debug/version")
async def debug_version():
    return {
        "osmnx": ox.__version__,
        "python": "3.8+",
        "server_time": datetime.now().isoformat(),
        "osrm_endpoint": OSRM_BASE_URL
    }

@app.post("/plan/by-coords")
async def plan_by_coords(req: PlanByCoordsRequest):
    try:
        if len(req.source) != 2 or len(req.target) != 2:
            raise HTTPException(status_code=400, detail="Source and target must be [lon, lat] arrays")
        
        src = (float(req.source[0]), float(req.source[1]))
        tgt = (float(req.target[0]), float(req.target[1]))
        
        start_time = datetime.now()
        result = await plan_pipeline_fast(src, tgt, req.cost)
        processing_time = (datetime.now() - start_time).total_seconds()
        
        result["metadata"]["api_processing_time_seconds"] = round(processing_time, 3)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/plan/by-names")
async def plan_by_names(req: PlanByNamesRequest):
    try:
        # Geocode locations
        s_point = ox.geocode(req.source_name)
        t_point = ox.geocode(req.target_name)
        
        if s_point is None:
            raise HTTPException(status_code=400, detail=f"Could not geocode source: {req.source_name}")
        if t_point is None:
            raise HTTPException(status_code=400, detail=f"Could not geocode target: {req.target_name}")
        
        src = (float(s_point[1]), float(s_point[0]))  # (lon, lat)
        tgt = (float(t_point[1]), float(t_point[0]))  # (lon, lat)
        
        start_time = datetime.now()
        result = await plan_pipeline_fast(src, tgt, req.cost)
        processing_time = (datetime.now() - start_time).total_seconds()
        
        result["metadata"]["api_processing_time_seconds"] = round(processing_time, 3)
        result["metadata"]["source_coords"] = src
        result["metadata"]["target_coords"] = tgt
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/test/quick")
async def test_quick():
    """Quick test endpoint with nearby points"""
    src = (72.5813, 23.0225)  # Ahmedabad center
    tgt = (72.5913, 23.0325)  # 1.5km away
    
    cost_params = CostParams()
    
    start_time = datetime.now()
    result = await plan_pipeline_fast(src, tgt, cost_params)
    processing_time = (datetime.now() - start_time).total_seconds()
    
    result["metadata"]["api_processing_time_seconds"] = round(processing_time, 3)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")