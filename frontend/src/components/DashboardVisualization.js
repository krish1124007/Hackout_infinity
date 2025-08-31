import React, { useState, useEffect } from 'react';
import SolarPanel from '../3dModels/SolarPanel';
import WindPower from '../3dModels/WindPower';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DashboardVisualization = ({ dashboardData }) => {
    const [mapView, setMapView] = useState('satellite');
    const mapRef = React.useRef(null);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.invalidateSize();
        }
    }, [mapView]);

    // Determine primary energy source based on capacity/efficiency
    const getPrimaryEnergySource = () => {
        if (!dashboardData?.landoptimizer?.suggested_locations?.[0]) return 'solar';
        
        const resources = dashboardData.landoptimizer.suggested_locations[0].resource_sizing;
        const solarUnits = parseInt(resources.solar_panels_required.replace(/[^\d]/g, ''));
        const windUnits = parseInt(resources.wind_turbines_required.replace(/[^\d]/g, ''));
        
        // Solar panels typically generate less per unit than wind turbines
        // If solar units > wind units * 5000, then solar is primary
        if (solarUnits > windUnits * 5000) {
            return 'solar';
        } else {
            return 'wind';
        }
    };

    const getSatelliteMapData = () => {
        if (!dashboardData?.landoptimizer?.suggested_locations) return null;
        
        const location = dashboardData.landoptimizer.suggested_locations[0];
        const consumers = location.nearby_consumers || [];
        
        return {
            plant: location.plant_location,
            consumers: consumers,
            coverage: {
                radius: 100,
                efficiency: 92
            }
        };
    };

    const renderInteractiveMap = () => {
        const mapData = getSatelliteMapData();
        if (!mapData) return <div className="loading">Loading map data...</div>;

        const plantPosition = [parseFloat(mapData.plant.latitude), parseFloat(mapData.plant.longitude)];

        const getTileLayerUrl = () => {
            switch (mapView) {
                case 'satellite': return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
                case 'terrain': return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; // Fallback to OSM for terrain
                case 'hybrid': return 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'; // Google Hybrid, requires subdomains
                default: return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            }
        };

        const getAttribution = () => {
            switch (mapView) {
                case 'satellite': return 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
                case 'terrain': return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
                case 'hybrid': return 'Google Maps';
                default: return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
            }
        };

        const customPlantIcon = new L.DivIcon({
            className: 'custom-plant-icon',
            html: '<div class="plant-icon-marker"><i class="fas fa-industry"></i></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -30]
        });

        const customConsumerIcon = new L.DivIcon({
            className: 'custom-consumer-icon',
            html: '<div class="consumer-icon-marker"><i class="fas fa-building"></i></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -20]
        });

        return (
            <div className="interactive-satellite-map">
                <div className="map-header">
                    <h3>Infrastructure Location Map</h3>
                    <div className="map-controls">
                        <button 
                            className={`map-btn ${mapView === 'satellite' ? 'active' : ''}`}
                            onClick={() => setMapView('satellite')}
                        >
                            <i className="fas fa-satellite"></i> Satellite
                        </button>
                        <button 
                            className={`map-btn ${mapView === 'terrain' ? 'active' : ''}`}
                            onClick={() => setMapView('terrain')}
                        >
                            <i className="fas fa-mountain"></i> Terrain
                        </button>
                        <button 
                            className={`map-btn ${mapView === 'hybrid' ? 'active' : ''}`}
                            onClick={() => setMapView('hybrid')}
                        >
                            <i className="fas fa-layer-group"></i> Hybrid
                        </button>
                    </div>
                </div>
                
                <div className="map-viewport">
                    <MapContainer 
                        center={plantPosition} 
                        zoom={10} 
                        scrollWheelZoom={true} 
                        style={{ height: '100%', width: '100%' }}
                        whenCreated={mapInstance => { mapRef.current = mapInstance; }}
                    >
                        <TileLayer
                            attribution={getAttribution()}
                            url={getTileLayerUrl()}
                            maxZoom={20}
                            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        />

                        <Marker position={plantPosition} icon={customPlantIcon}>
                            <Popup>
                                <strong>{mapData.plant.name}</strong><br />
                                <span>{mapData.plant.address}</span>
                            </Popup>
                        </Marker>

                        {mapData.consumers.map((consumer, index) => (
                            <Marker 
                                key={index} 
                                position={[parseFloat(consumer.latitude), parseFloat(consumer.longitude)]} 
                                icon={customConsumerIcon}
                            >
                                <Popup>
                                    <strong>{consumer.name}</strong><br />
                                    <span>{consumer.industry_type}</span><br />
                                    <span>Distance: {consumer.distance_from_plant}</span>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
                
                <div className="map-footer">
                    <div className="map-legend">
                        <div className="legend-group">
                            <h4>Infrastructure</h4>
                            <div className="legend-items">
                                <div className="legend-item">
                                    <div className="legend-marker plant-marker-legend"></div>
                                    <span>Production Plant</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-marker consumer-marker-legend"></div>
                                    <span>Industrial Consumers</span>
                                </div>
                            </div>
                        </div>
                        <div className="legend-group">
                            <h4>Coverage</h4>
                            <div className="legend-items">
                                <div className="legend-item">
                                    <div className="legend-marker coverage-marker-legend"></div>
                                    <span>Service Area</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-marker pipeline-legend"></div>
                                    <span>Distribution Network</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="map-statistics">
                        <div className="map-stat">
                            <i className="fas fa-map-marked-alt"></i>
                            <span>Land: {dashboardData.landoptimizer.suggested_locations[0].land_size_required}</span>
                        </div>
                        <div className="map-stat">
                            <i className="fas fa-industry"></i>
                            <span>{mapData.consumers.length} Connected Industries</span>
                        </div>
                        <div className="map-stat">
                            <i className="fas fa-truck"></i>
                            <span>Distribution Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!dashboardData?.landoptimizer?.suggested_locations) {
        return (
            <div className="visualization-loading">
                <div className="loading-content">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading visualization data...</p>
                </div>
            </div>
        );
    }

    const location = dashboardData.landoptimizer.suggested_locations[0];
    const resources = location.resource_sizing;
    
    // Correct calculation: 1000 units = 1 solar panel for 3D display
    const solarPanelCount = Math.floor(parseInt(resources.solar_panels_required.replace(/[^\d]/g, '')) / 1000);
    const windTurbineCount = parseInt(resources.wind_turbines_required.replace(/[^\d]/g, ''));
    const electrolyzerCount = parseInt(resources.electrolyzers_required.replace(/[^\d]/g, ''));
    
    // Determine which energy source to display
    const primaryEnergySource = getPrimaryEnergySource();
    const showSolar = primaryEnergySource === 'solar' && solarPanelCount > 0;
    const showWind = primaryEnergySource === 'wind' && windTurbineCount > 0;

    console.log('Solar Panel Count:', solarPanelCount);
    console.log('Wind Turbine Count:', windTurbineCount);
    console.log('Show Solar:', showSolar);
    console.log('Show Wind:', showWind);

    return (
        <>
            <style>
                {`
                .visualization-section {
                    padding: 20px 0;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .section-header h2 {
                    font-size: 2.5rem;
                    background: linear-gradient(135deg, #26667F, #124170);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0 0 10px 0;
                    font-weight: 700;
                }

                .section-header p {
                    color: #6B7280;
                    font-size: 1.1rem;
                    margin: 0;
                }

                .visualization-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                    min-height: 800px;
                }

                /* Enhanced Interactive Map */
                .map-section {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    padding: 30px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                    border: 1px solid rgba(103, 192, 144, 0.2);
                }

                .interactive-satellite-map {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .map-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .map-header h3 {
                    color: #124170;
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 600;
                }

                .map-controls {
                    display: flex;
                    gap: 8px;
                    background: rgba(221, 244, 231, 0.3);
                    padding: 4px;
                    border-radius: 10px;
                }

                .map-btn {
                    padding: 10px 16px;
                    border: none;
                    border-radius: 8px;
                    background: transparent;
                    color: #26667F;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .map-btn.active {
                    background: linear-gradient(135deg, #67C090, #26667F);
                    color: white;
                    box-shadow: 0 4px 15px rgba(103, 192, 144, 0.4);
                }

                .map-btn:hover:not(.active) {
                    background: rgba(103, 192, 144, 0.2);
                }

                .map-viewport {
                    flex: 1;
                    border-radius: 16px;
                    overflow: hidden;
                    position: relative;
                    border: 3px solid #67C090;
                    min-height: 500px;
                    box-shadow: inset 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                /* Remove the old satellite-terrain styles as Leaflet handles this */

                .leaflet-container {
                    background-color: transparent !important; /* Ensure Leaflet background is transparent */
                }

                /* Custom Leaflet Marker Icons */
                .custom-plant-icon .plant-icon-marker {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #67C090, #26667F);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.6rem;
                    color: white;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                    border: 2px solid white;
                }

                .custom-consumer-icon .consumer-icon-marker {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #26667F, #124170);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    color: white;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                    border: 2px solid white;
                }

                .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    padding: 10px;
                    font-size: 0.9rem;
                    line-height: 1.4;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                }

                .leaflet-popup-content strong {
                    color: #124170;
                }

                .leaflet-popup-content span {
                    color: #6B7280;
                }

                .coordinate-grid {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px);
                    background-size: 60px 60px;
                    pointer-events: none;
                }

                .plant-marker, .consumer-marker {
                    position: absolute;
                    z-index: 10;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .plant-marker:hover, .consumer-marker:hover {
                    transform: scale(1.1);
                    z-index: 20;
                }

                .marker-pulse-ring {
                    position: absolute;
                    width: 80px;
                    height: 80px;
                    border: 3px solid #67C090;
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: pulseRing 3s infinite;
                }

                @keyframes pulseRing {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                }

                .plant-facility, .consumer-facility {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .facility-icon, .consumer-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.6rem;
                    color: white;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
                    margin-bottom: 15px;
                    border: 3px solid white;
                    position: relative;
                    z-index: 2;
                }

                .facility-icon {
                    background: linear-gradient(135deg, #67C090, #26667F);
                }

                .consumer-icon {
                    background: linear-gradient(135deg, #26667F, #124170);
                    width: 40px;
                    height: 40px;
                    font-size: 1.3rem;
                }

                .facility-tooltip, .consumer-tooltip {
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 15px 18px;
                    border-radius: 12px;
                    text-align: center;
                    min-width: 180px;
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                    transform: translateY(-10px);
                }

                .consumer-tooltip {
                    min-width: 150px;
                    padding: 12px 15px;
                }

                .tooltip-header strong {
                    display: block;
                    font-size: 1.1rem;
                    margin-bottom: 5px;
                    color: #DDF4E7;
                }

                .facility-type, .industry-type {
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.8);
                    display: block;
                    margin-bottom: 8px;
                }

                .coordinates {
                    font-size: 0.75rem;
                    font-family: 'Courier New', monospace;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 8px;
                }

                .facility-status {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                }

                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #67C090;
                    animation: statusBlink 2s infinite;
                }

                @keyframes statusBlink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0.3; }
                }

                .distance-info {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.8);
                    margin-top: 5px;
                }

                .connection-pipeline {
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                }

                .service-coverage {
                    position: absolute;
                    top: 20%;
                    left: 20%;
                    width: 60%;
                    height: 60%;
                    pointer-events: none;
                }

                .coverage-circle {
                    position: absolute;
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .coverage-circle.primary {
                    width: 100%;
                    height: 100%;
                    border: 3px dashed rgba(103, 192, 144, 0.8);
                    background: radial-gradient(circle, rgba(103, 192, 144, 0.1) 0%, transparent 70%);
                    animation: coverageRotate 20s linear infinite;
                }

                .coverage-circle.secondary {
                    width: 70%;
                    height: 70%;
                    border: 2px solid rgba(103, 192, 144, 0.4);
                    background: radial-gradient(circle, rgba(103, 192, 144, 0.05) 0%, transparent 80%);
                    animation: coverageRotate 15s linear infinite reverse;
                }

                @keyframes coverageRotate {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }

                .coverage-info {
                    position: absolute;
                    bottom: -60px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 20px;
                    background: rgba(0, 0, 0, 0.8);
                    padding: 10px 15px;
                    border-radius: 8px;
                    backdrop-filter: blur(10px);
                }

                .coverage-stat {
                    text-align: center;
                }

                .coverage-label {
                    display: block;
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 2px;
                }

                .coverage-value {
                    display: block;
                    font-size: 0.9rem;
                    color: white;
                    font-weight: 600;
                }

                .map-footer {
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 2px solid rgba(103, 192, 144, 0.2);
                    display: flex;
                    justify-content: space-between;
                    gap: 30px;
                    flex-wrap: wrap;
                }

                .map-legend {
                    display: flex;
                    gap: 40px;
                }

                .legend-group h4 {
                    color: #124170;
                    font-size: 0.9rem;
                    margin: 0 0 10px 0;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .legend-items {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.85rem;
                    color: #26667F;
                    font-weight: 500;
                }

                .legend-marker {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .plant-marker-legend {
                    background: linear-gradient(135deg, #67C090, #26667F);
                }

                .consumer-marker-legend {
                    background: linear-gradient(135deg, #26667F, #124170);
                }

                .coverage-marker-legend {
                    background: rgba(103, 192, 144, 0.3);
                    border: 2px dashed #67C090;
                }

                .pipeline-legend {
                    background: #67C090;
                    border-radius: 2px;
                    height: 4px;
                }

                .map-statistics {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .map-stat {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #124170;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .map-stat i {
                    color: #67C090;
                    width: 20px;
                    text-align: center;
                }

                /* Enhanced 3D Model Section */
                .models-section {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    padding: 30px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                    border: 1px solid rgba(103, 192, 144, 0.2);
                    display: flex;
                    flex-direction: column;
                }

                .model-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .model-header h3 {
                    color: #124170;
                    margin: 0;
                    font-size: 1.6rem;
                    font-weight: 600;
                }

                .energy-source-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #67C090, #26667F);
                    color: white;
                    border-radius: 25px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(103, 192, 144, 0.4);
                }

                .model-3d-viewport {
                    height: 480px;
                    width: 100%; /* Ensure it takes full width of parent */
                    border-radius: 16px;
                    overflow: hidden;
                    /* background: linear-gradient(135deg, 
                        #DDF4E7 0%, 
                        rgba(255, 255, 255, 0.9) 30%, 
                        #DDF4E7 100%);  Remove this background as 3D models handle their own */
                    margin-bottom: 25px;
                    border: 2px solid #67C090;
                    position: relative;
                    box-shadow: inset 0 4px 20px rgba(103, 192, 144, 0.1);
                }

                .model-3d-viewport::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at center, transparent 20%, rgba(103, 192, 144, 0.05) 100%);
                    pointer-events: none;
                    z-index: 1;
                }

                .model-specifications {
                    margin-top: auto;
                }

                .spec-header {
                    color: #124170;
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 20px;
                    text-align: center;
                }

                .spec-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }

                .spec-card {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 20px;
                    background: linear-gradient(135deg, #DDF4E7, rgba(255, 255, 255, 0.9));
                    border-radius: 12px;
                    border: 1px solid #67C090;
                    transition: all 0.3s ease;
                }

                .spec-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(103, 192, 144, 0.25);
                }

                .spec-icon {
                    width: 45px;
                    height: 45px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                    color: white;
                    background: linear-gradient(135deg, #67C090, #26667F);
                    box-shadow: 0 4px 15px rgba(103, 192, 144, 0.3);
                }

                .spec-details {
                    flex: 1;
                }

                .spec-value {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #124170;
                    margin-bottom: 3px;
                    display: block;
                }

                .spec-label {
                    font-size: 0.85rem;
                    color: #6B7280;
                    font-weight: 500;
                }

                .visualization-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 400px;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    border: 1px solid rgba(103, 192, 144, 0.2);
                }

                .loading-content {
                    text-align: center;
                }

                .loading-content i {
                    font-size: 3rem;
                    color: #67C090;
                    margin-bottom: 15px;
                }

                .loading-content p {
                    color: #6B7280;
                    font-size: 1.1rem;
                    margin: 0;
                }

                /* Responsive Design */
                                /* Responsive Design */
                @media (max-width: 1200px) {
                    .visualization-content {
                        grid-template-columns: 1fr;
                        gap: 30px;
                    }
                    
                    .map-viewport {
                        min-height: 400px;
                    }
                    
                    .model-3d-viewport {
                        height: 400px;
                    }
                }

                @media (max-width: 768px) {
                    .section-header h2 {
                        font-size: 2rem;
                    }
                    
                    .map-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 15px;
                    }
                    
                    .map-controls {
                        width: 100%;
                        justify-content: center;
                    }
                    
                    .map-btn {
                        padding: 8px 12px;
                        font-size: 0.8rem;
                    }
                    
                    /* Remove old styles no longer needed */
                    .facility-tooltip, .consumer-tooltip, .tooltip-header strong, .map-footer, .map-legend, .legend-group, h4, .legend-items, .legend-item, .legend-marker, .plant-marker-legend, .consumer-marker-legend, .coverage-marker-legend, .pipeline-legend, .map-statistics, .map-stat {
                        /* These styles are for the old custom map and are replaced by Leaflet's default styling or custom Leaflet marker CSS */
                        display: none; /* Hide these elements if they are remnants of the old map */
                    }

                    .map-viewport .leaflet-container {
                       min-height: 300px; /* Ensure map has height on small screens */
                    }
                    
                    .facility-icon {
                        width: 40px;
                        height: 40px;
                        font-size: 1.4rem;
                    }
                    
                    .consumer-icon {
                        width: 35px;
                        height: 35px;
                        font-size: 1.2rem;
                    }
                    
                    .facility-tooltip, .consumer-tooltip {
                        min-width: 120px;
                        padding: 8px 10px;
                        font-size: 0.9rem;
                    }
                    
                    .coverage-info {
                        flex-direction: column;
                        gap: 10px;
                        bottom: -80px;
                    }
                    
                    .spec-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .spec-card {
                        padding: 15px;
                    gap: 12px;
                    flex-direction: column;
                        text-align: center;
                    }
                    
                    .spec-icon {
                        width: 40px;
                        height: 40px;
                        font-size: 1.2rem;
                    }
                    
                    .spec-value {
                        font-size: 1.2rem;
                    }
                    
                    .energy-source-badge {
                        padding: 10px 16px;
                        font-size: 0.9rem;
                    }
                    
                    .map-btn {
                        padding: 6px 10px;
                        font-size: 0.75rem;
                        i {
                            margin-right: 4px;
                        }
                    }
                }

                /* High DPI Screens */
                @media (min-resolution: 2dppx) {
                    .coordinate-grid {
                        background-size: 30px 30px;
                    }
                    
                    .satellite-terrain {
                        background-size: 200%;
                    }
                }

                /* Dark Mode Support */
                @media (prefers-color-scheme: dark) {
                    .map-section, .models-section {
                        background: rgba(18, 65, 112, 0.95);
                        border-color: rgba(103, 192, 144, 0.3);
                    }
                    
                    .map-header h3, .model-header h3 {
                        color: #DDF4E7;
                    }
                    
                    .map-btn {
                        background: rgba(38, 102, 127, 0.3);
                        color: #DDF4E7;
                    }
                    
                    .map-btn.active {
                        background: linear-gradient(135deg, #67C090, #26667F);
                    }
                    
                    .spec-card {
                        background: linear-gradient(135deg, rgba(38, 102, 127, 0.2), rgba(18, 65, 112, 0.3));
                        border-color: rgba(103, 192, 144, 0.4);
                    }
                    
                    .spec-value {
                        color: #DDF4E7;
                    }
                    
                    .spec-label {
                        color: rgba(221, 244, 231, 0.8);
                    }
                }

                /* Print Styles */
                @media print {
                    .visualization-section {
                        background: white !important;
                        color: black !important;
                    }
                    
                    .map-section, .models-section {
                        background: white !important;
                        border: 2px solid #ccc !important;
                        box-shadow: none !important;
                    }
                    
                    .map-btn, .energy-source-badge {
                        display: none !important;
                    }
                    
                    .spec-card {
                        break-inside: avoid;
                    }
                }
                `}
            </style>

            <div className="visualization-section">
                <div className="section-header">
                    <h2>3D Infrastructure Visualization</h2>
                    <p>Interactive satellite view and 3D models of green hydrogen infrastructure</p>
                </div>

                <div className="visualization-content">
                    {/* Interactive Map Section */}
                    <div className="map-section">
                        {renderInteractiveMap()}
                    </div>

                    {/* 3D Models Section */}
                    <div className="models-section">
                        <div className="model-header">
                            <h3>Energy Infrastructure</h3>
                            <div className="energy-source-badge">
                                <i className={`fas ${showSolar ? 'fa-sun' : 'fa-wind'}`}></i>
                                <span>Primary: {showSolar ? 'Solar Power' : 'Wind Power'}</span>
                            </div>
                        </div>

                        <div className="model-3d-viewport">
                            {showSolar && (
                                <SolarPanel 
                                    solarPanelCount={Math.min(solarPanelCount, 15)} 
                                    electrolysisCount={Math.min(electrolyzerCount, 10)}
                                    scale={0.8}
                                />
                            )}
                            {showWind && (
                                <WindPower 
                                    windTurbineCount={Math.min(windTurbineCount, 8)} 
                                    electrolysisCount={Math.min(electrolyzerCount, 8)}
                                    scale={0.7}
                                />
                            )}
                        </div>

                        <div className="model-specifications">
                            <h4 className="spec-header">Infrastructure Specifications</h4>
                            <div className="spec-grid">
                                <div className="spec-card">
                                    <div className="spec-icon">
                                        <i className="fas fa-bolt"></i>
                                    </div>
                                    <div className="spec-details">
                                        <span className="spec-value">{resources.electrolyzers_required}</span>
                                        <span className="spec-label">Electrolyzers</span>
                                    </div>
                                </div>
                                
                                <div className="spec-card">
                                    <div className="spec-icon">
                                        <i className="fas fa-solar-panel"></i>
                                    </div>
                                    <div className="spec-details">
                                        <span className="spec-value">{resources.solar_panels_required}</span>
                                        <span className="spec-label">Solar Panels</span>
                                    </div>
                                </div>
                                
                                <div className="spec-card">
                                    <div className="spec-icon">
                                        <i className="fas fa-wind"></i>
                                    </div>
                                    <div className="spec-details">
                                        <span className="spec-value">{resources.wind_turbines_required}</span>
                                        <span className="spec-label">Wind Turbines</span>
                                    </div>
                                </div>
                                
                                <div className="spec-card">
                                    <div className="spec-icon">
                                        <i className="fas fa-industry"></i>
                                    </div>
                                    <div className="spec-details">
                                        <span className="spec-value">{location.land_size_required}</span>
                                        <span className="spec-label">Land Area</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardVisualization;