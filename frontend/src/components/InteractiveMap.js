import React, { useState, useRef, useEffect } from 'react';

const InteractiveMap = () => {
  const [mapExpanded, setMapExpanded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [currentView, setCurrentView] = useState('india'); // 'india' or 'city'
  const mapRef = useRef(null);

  const toggleMapView = () => {
    setMapExpanded(!mapExpanded);
  };

  // India map marker data with realistic coordinates and details
  const indiaMarkers = [
    { 
      id: 1, 
      lat: 28.6139, 
      lng: 77.2090, 
      type: 'production', 
      name: 'Delhi Hydrogen Plant', 
      capacity: '4,500 kg/day',
      status: 'Operational',
      co2Reduction: '22,000 tons/year',
      technology: 'Alkaline Electrolysis',
      state: 'Delhi'
    },
    { 
      id: 2, 
      lat: 19.0760, 
      lng: 72.8777, 
      type: 'storage', 
      name: 'Mumbai Storage Facility', 
      capacity: '3,200 kg',
      status: 'Operational',
      completion: '2023',
      state: 'Maharashtra'
    },
    { 
      id: 3, 
      lat: 13.0827, 
      lng: 80.2707, 
      type: 'distribution', 
      name: 'Chennai Distribution Hub', 
      capacity: '2,800 kg/day',
      status: 'Operational',
      connectedFacilities: 8,
      state: 'Tamil Nadu'
    },
    { 
      id: 4, 
      lat: 12.9716, 
      lng: 77.5946, 
      type: 'production', 
      name: 'Bengaluru Green Hydrogen', 
      capacity: '6,200 kg/day',
      status: 'Under Construction',
      startDate: 'Q4 2024',
      state: 'Karnataka'
    },
    { 
      id: 5, 
      lat: 22.5726, 
      lng: 88.3639, 
      type: 'refueling', 
      name: 'Kolkata Refueling Station', 
      capacity: '450 vehicles/day',
      status: 'Operational',
      vehiclesServed: '12,500+',
      state: 'West Bengal'
    },
    { 
      id: 6, 
      lat: 17.3850, 
      lng: 78.4867, 
      type: 'production', 
      name: 'Hyderabad Hydrogen Facility', 
      capacity: '3,800 kg/day',
      status: 'Planned',
      startDate: '2025',
      state: 'Telangana'
    },
    { 
      id: 7, 
      lat: 26.9124, 
      lng: 75.7873, 
      type: 'storage', 
      name: 'Jaipur Storage Depot', 
      capacity: '2,100 kg',
      status: 'Under Construction',
      completion: 'Q2 2024',
      state: 'Rajasthan'
    }
  ];

  // Detailed view for a specific city (Delhi example)
  const delhiMarkers = [
    {
      id: 101,
      lat: 28.6139,
      lng: 77.2090,
      type: 'production',
      name: 'Central Delhi Hydrogen Plant',
      capacity: '2,500 kg/day',
      status: 'Operational',
      technology: 'PEM Electrolysis'
    },
    {
      id: 102,
      lat: 28.7041,
      lng: 77.1025,
      type: 'refueling',
      name: 'North Delhi Refueling Station',
      capacity: '300 vehicles/day',
      status: 'Operational'
    },
    {
      id: 103,
      lat: 28.4595,
      lng: 77.0266,
      type: 'distribution',
      name: 'South Delhi Distribution Center',
      capacity: '1,800 kg/day',
      status: 'Operational'
    },
    {
      id: 104,
      lat: 28.7242,
      lng: 77.2103,
      type: 'storage',
      name: 'East Delhi Storage Facility',
      capacity: '1,500 kg',
      status: 'Under Construction'
    }
  ];

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setShowInfoPanel(true);
    
    // If on India view and clicking Delhi, zoom to city view
    if (currentView === 'india' && marker.name.includes('Delhi')) {
      setTimeout(() => {
        setCurrentView('delhi');
      }, 500);
    }
  };

  const handleBackToIndia = () => {
    setCurrentView('india');
    setSelectedMarker(null);
    setShowInfoPanel(false);
  };

  const getMarkerColor = (type) => {
    switch (type) {
      case 'production':
        return '#27AE60'; // Green
      case 'storage':
        return '#2D9CDB'; // Blue
      case 'distribution':
        return '#F2C94C'; // Yellow
      case 'refueling':
        return '#EB5757'; // Red
      default:
        return '#9B51E0'; // Purple
    }
  };

  const getMarkerIcon = (type) => {
    switch (type) {
      case 'production':
        return 'fas fa-industry';
      case 'storage':
        return 'fas fa-database';
      case 'distribution':
        return 'fas fa-truck';
      case 'refueling':
        return 'fas fa-gas-pump';
      default:
        return 'fas fa-map-marker-alt';
    }
  };

  // Initialize map simulation
  useEffect(() => {
    if (mapRef.current) {
      const mapElement = mapRef.current;
      mapElement.innerHTML = '';
      
      // Create map background
      const mapBackground = document.createElement('div');
      mapBackground.style.width = '100%';
      mapBackground.style.height = '100%';
      mapBackground.style.position = 'relative';
      mapBackground.style.overflow = 'hidden';
      
      if (currentView === 'india') {
        // India map view
        mapBackground.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
        
        // Draw simplified India outline
        const indiaOutline = document.createElement('div');
        indiaOutline.style.position = 'absolute';
        indiaOutline.style.top = '10%';
        indiaOutline.style.left = '15%';
        indiaOutline.style.width = '70%';
        indiaOutline.style.height = '80%';
        indiaOutline.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        indiaOutline.style.borderRadius = '20px 20px 60px 20px';
        indiaOutline.style.background = 'rgba(255, 255, 255, 0.05)';
        mapBackground.appendChild(indiaOutline);
        
        // Add state boundaries (simplified)
        const states = [
          { top: '5%', left: '20%', width: '15%', height: '25%', name: 'Jammu & Kashmir' },
          { top: '30%', left: '15%', width: '20%', height: '20%', name: 'Rajasthan' },
          { top: '50%', left: '25%', width: '15%', height: '15%', name: 'Gujarat' },
          { top: '25%', left: '40%', width: '20%', height: '20%', name: 'Uttar Pradesh' },
          { top: '45%', left: '45%', width: '15%', height: '15%', name: 'Madhya Pradesh' },
          { top: '60%', left: '50%', width: '15%', height: '20%', name: 'Maharashtra' },
          { top: '70%', left: '60%', width: '15%', height: '15%', name: 'Karnataka' },
          { top: '80%', left: '70%', width: '15%', height: '15%', name: 'Tamil Nadu' },
          { top: '15%', left: '70%', width: '20%', height: '20%', name: 'West Bengal' },
        ];
        
        states.forEach(state => {
          const stateDiv = document.createElement('div');
          stateDiv.style.position = 'absolute';
          stateDiv.style.top = state.top;
          stateDiv.style.left = state.left;
          stateDiv.style.width = state.width;
          stateDiv.style.height = state.height;
          stateDiv.style.border = '1px solid rgba(255, 255, 255, 0.1)';
          stateDiv.style.background = 'rgba(255, 255, 255, 0.02)';
          mapBackground.appendChild(stateDiv);
        });
        
      } else {
        // Delhi city view
        mapBackground.style.background = 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)';
        
        // Draw major areas of Delhi
        const areas = [
          { top: '20%', left: '30%', width: '25%', height: '20%', name: 'Central Delhi' },
          { top: '10%', left: '50%', width: '20%', height: '15%', name: 'North Delhi' },
          { top: '40%', left: '40%', width: '20%', height: '25%', name: 'South Delhi' },
          { top: '25%', left: '65%', width: '20%', height: '20%', name: 'East Delhi' },
          { top: '50%', left: '20%', width: '15%', height: '20%', name: 'West Delhi' },
        ];
        
        areas.forEach(area => {
          const areaDiv = document.createElement('div');
          areaDiv.style.position = 'absolute';
          areaDiv.style.top = area.top;
          areaDiv.style.left = area.left;
          areaDiv.style.width = area.width;
          areaDiv.style.height = area.height;
          areaDiv.style.border = '1px solid rgba(255, 255, 255, 0.15)';
          areaDiv.style.background = 'rgba(255, 255, 255, 0.03)';
          areaDiv.style.borderRadius = '8px';
          mapBackground.appendChild(areaDiv);
        });
        
        // Add major roads
        const roads = [
          { top: '30%', left: '10%', width: '80%', height: '3px', transform: 'rotate(0deg)' },
          { top: '50%', left: '10%', width: '80%', height: '3px', transform: 'rotate(0deg)' },
          { top: '10%', left: '30%', width: '60%', height: '3px', transform: 'rotate(90deg)' },
          { top: '10%', left: '60%', width: '60%', height: '3px', transform: 'rotate(90deg)' },
        ];
        
        roads.forEach(road => {
          const roadDiv = document.createElement('div');
          roadDiv.style.position = 'absolute';
          roadDiv.style.top = road.top;
          roadDiv.style.left = road.left;
          roadDiv.style.width = road.width;
          roadDiv.style.height = road.height;
          roadDiv.style.background = 'rgba(255, 255, 255, 0.2)';
          roadDiv.style.transform = road.transform;
          mapBackground.appendChild(roadDiv);
        });
      }
      
      mapElement.appendChild(mapBackground);
    }
  }, [mapExpanded, currentView]);

  const currentMarkers = currentView === 'india' ? indiaMarkers : delhiMarkers;

  return (
    <>
      <style>
        {`
        .interactive-map-section {
          padding: 100px 0;
          background: var(--primary-dark);
          position: relative;
        }

        .interactive-map {
          background: var(--secondary-dark);
          border-radius: 20px;
          padding: 0;
          margin: 50px 0;
          border: 2px solid rgba(39, 174, 96, 0.3);
          position: relative;
          height: ${mapExpanded ? '600px' : '400px'};
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .interactive-map:hover {
          border-color: var(--accent-teal);
          box-shadow: var(--glow-secondary);
        }

        .map-container {
          width: 100%;
          height: 100%;
          border-radius: 18px;
          overflow: hidden;
          position: relative;
        }

        .hydrogen-marker {
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transform: translate(-50%, -50%);
          border: 2px solid white;
        }

        .hydrogen-marker:hover {
          transform: translate(-50%, -50%) scale(1.2);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
          z-index: 11;
        }

        .hydrogen-marker::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: inherit;
          filter: blur(8px);
          opacity: 0.6;
          z-index: -1;
          animation: pulse 2s infinite;
        }

        .map-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(8, 28, 21, 0.9);
          color: white;
          z-index: 20;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .map-overlay:hover {
          background: rgba(8, 28, 21, 0.95);
        }

        .map-expand-btn {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: var(--gradient-primary);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          z-index: 15;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .map-expand-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }

        .section-title {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title h2 {
          font-size: 2.5rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .section-title p {
          font-size: 1.2rem;
          color: var(--text-muted);
        }

        .info-panel {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(27, 67, 50, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(39, 174, 96, 0.3);
          border-radius: 15px;
          padding: 20px;
          width: 320px;
          z-index: 20;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transform: translateX(${showInfoPanel ? '0' : '350px'});
          transition: transform 0.4s ease;
        }

        .info-panel h3 {
          color: var(--accent-green);
          margin-bottom: 15px;
          font-size: 1.4rem;
          border-bottom: 2px solid var(--accent-teal);
          padding-bottom: 10px;
        }

        .info-detail {
          margin-bottom: 12px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .info-detail i {
          color: var(--accent-teal);
          width: 20px;
          margin-top: 2px;
        }

        .info-detail span {
          color: var(--text-light);
          font-size: 0.95rem;
          flex: 1;
        }

        .close-panel {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 1.2rem;
          transition: color 0.3s ease;
        }

        .close-panel:hover {
          color: var(--accent-teal);
        }

        .map-controls {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 15;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .map-control {
          background: rgba(27, 67, 50, 0.9);
          border: 1px solid rgba(39, 174, 96, 0.3);
          color: var(--text-light);
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .map-control:hover {
          background: rgba(39, 174, 96, 0.2);
          border-color: var(--accent-green);
        }

        .back-button {
          position: absolute;
          top: 20px;
          left: 70px;
          background: rgba(27, 67, 50, 0.9);
          border: 1px solid rgba(39, 174, 96, 0.3);
          color: var(--text-light);
          padding: 8px 15px;
          border-radius: 8px;
          cursor: pointer;
          z-index: 15;
          display: ${currentView === 'delhi' ? 'flex' : 'none'};
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: rgba(39, 174, 96, 0.2);
          border-color: var(--accent-green);
        }

        .view-title {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(27, 67, 50, 0.9);
          border: 1px solid rgba(39, 174, 96, 0.3);
          color: var(--text-light);
          padding: 8px 20px;
          border-radius: 20px;
          z-index: 15;
          font-weight: 600;
          backdrop-filter: blur(5px);
        }

        .legend {
          position: absolute;
          bottom: 70px;
          left: 20px;
          background: rgba(27, 67, 50, 0.9);
          border: 1px solid rgba(39, 174, 96, 0.3);
          border-radius: 10px;
          padding: 15px;
          z-index: 15;
          backdrop-filter: blur(5px);
        }

        .legend-title {
          color: var(--text-light);
          font-weight: 600;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          gap: 8px;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .legend-label {
          color: var(--text-light);
          font-size: 0.8rem;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.6; }
        }

        :root {
          --primary-dark: #081C15;
          --secondary-dark: #1B4332;
          --accent-teal: #2D9CDB;
          --accent-green: #27AE60;
          --accent-mint: #90EE90;
          --accent-aqua: #20B2AA;
          --text-light: #F8F9FA;
          --text-muted: #ADB5BD;
          --gradient-primary: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-teal) 100%);
          --gradient-secondary: linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-aqua) 100%);
          --glow-primary: 0 0 20px rgba(39, 174, 96, 0.4);
          --glow-secondary: 0 0 15px rgba(45, 156, 219, 0.3);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .me-2 { margin-right: 0.5rem; }
        .mb-3 { margin-bottom: 1rem; }
        .text-success { color: var(--accent-green) !important; }

        @media (max-width: 768px) {
          .interactive-map {
            height: ${mapExpanded ? '500px' : '300px'} !important;
          }
          
          .info-panel {
            width: 250px;
            right: 10px;
          }
          
          .section-title h2 {
            font-size: 2rem;
          }
          
          .legend {
            bottom: 60px;
            left: 10px;
            padding: 10px;
          }
        }
        `}
      </style>
      
      <section id="demo" className="interactive-map-section">
        <div className="container">
          <div className="section-title">
            <h2>India Hydrogen Infrastructure Network</h2>
            <p>Interactive map showing current and planned hydrogen facilities across India</p>
          </div>
          <div className="interactive-map">
            <div className="map-container" ref={mapRef}>
              {/* Map content will be generated by JavaScript */}
              
              {/* Map markers */}
              {currentMarkers.map(marker => (
                <div
                  key={marker.id}
                  className="hydrogen-marker"
                  style={{
                    top: currentView === 'india' 
                      ? `${((marker.lat - 18.0) * 3.5 + 10)}%` 
                      : `${((marker.lat - 28.45) * 100 + 40)}%`,
                    left: currentView === 'india' 
                      ? `${((marker.lng - 68.0) * 2.2 + 10)}%` 
                      : `${((marker.lng - 77.0) * 100 + 40)}%`,
                    background: getMarkerColor(marker.type)
                  }}
                  onClick={() => handleMarkerClick(marker)}
                  title={marker.name}
                >
                  <i className={getMarkerIcon(marker.type)}></i>
                </div>
              ))}
              
              {/* View title */}
              <div className="view-title">
                {currentView === 'india' ? 'India Overview' : 'Delhi Metropolitan Area'}
              </div>
              
              {/* Map controls */}
              <div className="map-controls">
                <div className="map-control" title="Zoom In">
                  <i className="fas fa-plus"></i>
                </div>
                <div className="map-control" title="Zoom Out">
                  <i className="fas fa-minus"></i>
                </div>
                <div className="map-control" title="Reset View">
                  <i className="fas fa-home"></i>
                </div>
              </div>
              
              {/* Back button for city view */}
              <button className="back-button" onClick={handleBackToIndia}>
                <i className="fas fa-arrow-left"></i>
                Back to India
              </button>
              
              {/* Legend */}
              <div className="legend">
                <div className="legend-title">Facility Types</div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#27AE60'}}></div>
                  <span className="legend-label">Production</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#2D9CDB'}}></div>
                  <span className="legend-label">Storage</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#F2C94C'}}></div>
                  <span className="legend-label">Distribution</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#EB5757'}}></div>
                  <span className="legend-label">Refueling</span>
                </div>
              </div>
              
              {/* Info panel */}
              {selectedMarker && (
                <div className="info-panel">
                  <button 
                    className="close-panel"
                    onClick={() => setShowInfoPanel(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <h3>{selectedMarker.name}</h3>
                  <div className="info-detail">
                    <i className="fas fa-tag"></i>
                    <span>Type: {selectedMarker.type.charAt(0).toUpperCase() + selectedMarker.type.slice(1)}</span>
                  </div>
                  <div className="info-detail">
                    <i className="fas fa-bolt"></i>
                    <span>Status: {selectedMarker.status}</span>
                  </div>
                  <div className="info-detail">
                    <i className="fas fa-weight-hanging"></i>
                    <span>Capacity: {selectedMarker.capacity}</span>
                  </div>
                  {selectedMarker.co2Reduction && (
                    <div className="info-detail">
                      <i className="fas fa-leaf"></i>
                      <span>CO₂ Reduction: {selectedMarker.co2Reduction}</span>
                    </div>
                  )}
                  {selectedMarker.technology && (
                    <div className="info-detail">
                      <i className="fas fa-cogs"></i>
                      <span>Technology: {selectedMarker.technology}</span>
                    </div>
                  )}
                  {selectedMarker.state && (
                    <div className="info-detail">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>State: {selectedMarker.state}</span>
                    </div>
                  )}
                </div>
              )}
              
              {!mapExpanded && (
                <div 
                  className="map-overlay" 
                  onClick={toggleMapView}
                >
                  <i className="fas fa-play-circle fa-4x text-success mb-3"></i>
                  <h4>Interactive Map Demo</h4>
                  <p>Click to explore India's hydrogen infrastructure</p>
                </div>
              )}
            </div>
            <button className="map-expand-btn" onClick={toggleMapView}>
              <i className={`fas fa-${mapExpanded ? 'compress' : 'expand'}`}></i>
              {mapExpanded ? 'Minimize Map' : 'Expand Map'}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default InteractiveMap;