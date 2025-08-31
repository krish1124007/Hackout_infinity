import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Assuming Bootstrap 5 and Font Awesome are loaded globally via CDN.
// This is necessary for this single-file setup as external CSS/JS imports are not supported.
// The code relies on the presence of L from the Leaflet library.

const Map = () => {
  // --- State Hooks for managing UI and data ---
  const [sourceName, setSourceName] = useState('Ahmedabad, Gujarat');
  const [targetName, setTargetName] = useState('Surat, Gujarat');
  const [pipeCost, setPipeCost] = useState(50000000);
  const [landMultiplier, setLandMultiplier] = useState(1.15);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // --- Refs for non-React DOM elements (Leaflet map) ---
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const routeLayerRef = React.useRef(null);
  const startMarkerRef = React.useRef(null);
  const endMarkerRef = React.useRef(null);

  // --- Helper function to format currency ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // --- Effect to initialize the map once on component mount ---
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const L = window.L;
      if (L) {
        const map = L.map(mapRef.current).setView([23.0225, 72.5714], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);
        mapInstanceRef.current = map;
      }
    }
  }, []);

  // --- Effect to draw the route and markers when results are updated ---
  useEffect(() => {
    if (results && mapInstanceRef.current && window.L) {
      const L = window.L;
      const map = mapInstanceRef.current;

      // Clear previous layers
      if (routeLayerRef.current) map.removeLayer(routeLayerRef.current);
      if (startMarkerRef.current) map.removeLayer(startMarkerRef.current);
      if (endMarkerRef.current) map.removeLayer(endMarkerRef.current);

      const coordinates = results.line.geometry.coordinates;
      const sourceCoords = results.metadata.source_coords;
      const targetCoords = results.metadata.target_coords;

      // Convert coordinates for Leaflet ([lat, lng] format)
      const latLngs = coordinates.map((coord) => [coord[1], coord[0]]);

      // Draw route
      routeLayerRef.current = L.polyline(latLngs, {
        color: '#3b82f6',
        weight: 6,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Add markers
      startMarkerRef.current = L.marker([sourceCoords[1], sourceCoords[0]], {
        icon: L.divIcon({
          html: '<div style="background-color: #198754; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
          className: 'custom-marker',
        }),
      }).addTo(map).bindPopup('Start: Source Location');

      endMarkerRef.current = L.marker([targetCoords[1], targetCoords[0]], {
        icon: L.divIcon({
          html: '<div style="background-color: #dc3545; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
          className: 'custom-marker',
        }),
      }).addTo(map).bindPopup('End: Target Location');

      // Fit map to show entire route
      map.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
    }
  }, [results]);

  // --- Function to get current location ---
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setMessage('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get location name
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(response => response.json())
          .then(data => {
            const locationName = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setSourceName(locationName);
            setUseCurrentLocation(true);
            setMessage('');
            
            // Update map to show current location
            if (mapInstanceRef.current && window.L) {
              const L = window.L;
              if (startMarkerRef.current) mapInstanceRef.current.removeLayer(startMarkerRef.current);
              
              startMarkerRef.current = L.marker([latitude, longitude], {
                icon: L.divIcon({
                  html: '<div style="background-color: #198754; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
                  className: 'custom-marker',
                }),
              }).addTo(mapInstanceRef.current).bindPopup('Your Current Location');
              
              mapInstanceRef.current.setView([latitude, longitude], 13);
            }
          })
          .catch(error => {
            console.error('Reverse geocoding failed:', error);
            setSourceName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setUseCurrentLocation(true);
            setMessage('');
          })
          .finally(() => {
            setIsGettingLocation(false);
          });
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to retrieve your location';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access to use this feature.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setMessage(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // --- Function to handle manual location input ---
  const handleManualLocation = () => {
    setUseCurrentLocation(false);
    setSourceName('');
  };

  // --- Function to handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate source name
    if (!sourceName.trim()) {
      setMessage('Please enter a source location');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setShowResults(false);

    const formData = {
      source_name: sourceName,
      target_name: targetName,
      cost: {
        pipe_capex_per_km_inr: parseFloat(pipeCost),
        land_multiplier: parseFloat(landMultiplier),
        design_contingency_pct: 0.1,
        opex_pct_per_year: 0.03,
        forbid_residential: true,
        residential_multiplier: 1000000000,
        water_multiplier: 50.0,
        score_to_inr_unit: 20000000,
      },
    };

    try {
      const response = await fetch('https://python-back-7x0p.onrender.com/plan/by-names', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to calculate route:', error);
      setMessage('Failed to calculate route. Please check the API server.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Message Modal Component ---
  const MessageModal = ({ message, onClose }) => {
    if (!message) return null;
    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Notification</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-light min-vh-100 font-sans">
      <style>
        {`
          .card-custom {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
          }
          .card-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          }
          .custom-gradient-bg {
            background-image: linear-gradient(to bottom right, #e0f2fe, #eef2ff);
          }
          .location-options {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
          }
          .location-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .location-btn.active {
            border-color: #3b82f6;
            background-color: #eef6ff;
          }
          .location-btn:hover:not(.active) {
            border-color: #adb5bd;
          }
        `}
      </style>
      <MessageModal message={message} onClose={() => setMessage('')} />

      <div className="container py-5">
        {/* Header */}
        <header className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark mb-2">
            <i className="fas fa-pipe text-primary me-3"></i>
            Hydrogen Pipeline Planner
          </h1>
          <p className="text-muted">Plan optimal routes with real-time cost analysis</p>
        </header>

        {/* Main Content */}
        <div className="row g-4">
          {/* Input Form */}
          <div className="col-lg-4">
            <div className="card-custom">
              <h2 className="h4 fw-semibold mb-4 text-dark">
                <i className="fas fa-route text-primary me-2"></i>
                Plan New Route
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small">Source Location</label>
                  <div className="location-options">
                    <div 
                      className={`location-btn ${useCurrentLocation ? 'active' : ''}`}
                      onClick={getCurrentLocation}
                    >
                      <i className="fas fa-location-arrow"></i>
                      Current Location
                    </div>
                    <div 
                      className={`location-btn ${!useCurrentLocation ? 'active' : ''}`}
                      onClick={handleManualLocation}
                    >
                      <i className="fas fa-map-marker-alt"></i>
                      Manual Input
                    </div>
                  </div>
                  
                  {useCurrentLocation ? (
                    <div className="alert alert-info py-2">
                      <small>
                        <i className="fas fa-info-circle me-1"></i>
                        Using your current location
                        {isGettingLocation && (
                          <span className="ms-2">
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                            Detecting...
                          </span>
                        )}
                      </small>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={sourceName}
                      onChange={(e) => setSourceName(e.target.value)}
                      className="form-control"
                      placeholder="e.g., Ahmedabad, Gujarat"
                    />
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="targetInput" className="form-label text-muted small">Target Location</label>
                  <input
                    type="text"
                    id="targetInput"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    className="form-control"
                    placeholder="e.g., Surat, Gujarat"
                  />
                </div>
                
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="pipeCost" className="form-label text-muted small">Pipe Cost/km (₹)</label>
                    <input
                      type="number"
                      id="pipeCost"
                      value={pipeCost}
                      onChange={(e) => setPipeCost(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="landMultiplier" className="form-label text-muted small">Land Multiplier</label>
                    <input
                      type="number"
                      id="landMultiplier"
                      step="0.01"
                      value={landMultiplier}
                      onChange={(e) => setLandMultiplier(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 fw-bold"
                  disabled={isLoading || isGettingLocation}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-bolt me-2"></i>
                      Calculate Optimal Route
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="col-lg-8">
            <div className="card-custom">
              <h2 className="h4 fw-semibold mb-4 text-dark">
                <i className="fas fa-map-marked-alt text-success me-2"></i>
                Route Visualization
              </h2>
              <div ref={mapRef} id="map" style={{ height: '500px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}></div>
            </div>
          </div>
        </div>

        {/* Results Dashboard */}
        {showResults && results && (
          <div className="mt-4">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
              {/* Total Distance */}
              <div className="col">
                <div className="card-custom text-center h-100">
                  <div className="fs-3 text-primary mb-2"><i className="fas fa-ruler-combined"></i></div>
                  <h3 className="h6 fw-semibold text-muted">Total Distance</h3>
                  <p className="fs-4 fw-bold text-dark">{results.summary.total_km} km</p>
                </div>
              </div>

              {/* CAPEX Estimate */}
              <div className="col">
                <div className="card-custom text-center h-100">
                  <div className="fs-3 text-success mb-2"><i className="fas fa-money-bill-wave"></i></div>
                  <h3 className="h6 fw-semibold text-muted">CAPEX Estimate</h3>
                  <p className="fs-4 fw-bold text-dark">{formatCurrency(results.summary.capex_by_km_inr)}</p>
                </div>
              </div>

              {/* Annual OPEX */}
              <div className="col">
                <div className="card-custom text-center h-100">
                  <div className="fs-3 text-warning mb-2"><i className="fas fa-cogs"></i></div>
                  <h3 className="h6 fw-semibold text-muted">Annual OPEX</h3>
                  <p className="fs-4 fw-bold text-dark">{formatCurrency(results.summary.annual_opex_inr)}</p>
                </div>
              </div>

              {/* Obstacles */}
              <div className="col">
                <div className="card-custom text-center h-100">
                  <div className="fs-3 text-danger mb-2"><i className="fas fa-exclamation-triangle"></i></div>
                  <h3 className="h6 fw-semibold text-muted">Obstacles</h3>
                  <p className="fs-5 fw-bold text-dark">
                    {results.summary.has_residential && 'Residential Areas, '}
                    {results.summary.has_water && 'Water Bodies'}
                    {!results.summary.has_residential && !results.summary.has_water && 'None'}
                  </p>
                </div>
              </div>
            </div>

            {/* Route Details */}
            <div className="mt-4 card-custom">
              <h2 className="h4 fw-semibold mb-4 text-dark">
                <i className="fas fa-info-circle text-info me-2"></i>
                Route Details
              </h2>
              <div className="row g-4">
                <div className="col-md-6">
                  <h4 className="h6 fw-semibold text-muted">Source Coordinates</h4>
                  <p className="text-dark">
                    {results.metadata.source_coords[1].toFixed(6)}, {results.metadata.source_coords[0].toFixed(6)}
                  </p>
                </div>
                <div className="col-md-6">
                  <h4 className="h6 fw-semibold text-muted">Target Coordinates</h4>
                  <p className="text-dark">
                    {results.metadata.target_coords[1].toFixed(6)}, {results.metadata.target_coords[0].toFixed(6)}
                  </p>
                </div>
                <div className="col-md-6">
                  <h4 className="h6 fw-semibold text-muted">Processing Time</h4>
                  <p className="text-dark">{results.metadata.api_processing_time_seconds} seconds</p>
                </div>
                <div className="col-md-6">
                  <h4 className="h6 fw-semibold text-muted">Routing Engine</h4>
                  <p className="text-dark">{results.metadata.routing_engine}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;