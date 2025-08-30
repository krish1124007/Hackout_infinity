import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different types of locations
const createCustomIcon = (color, iconName) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;">
            <i class="fas ${iconName}" style="color: white; transform: rotate(45deg); font-size: 12px;"></i>
          </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const plantIcon = createCustomIcon('#4CAF50', 'fa-industry');
const consumerIcon = createCustomIcon('#2196F3', 'fa-building');

const PlantLocationMap = () => {
  const [plantData, setPlantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const response = await fetch('https://hackout2025-backend-infinity.onrender.com/api/v1/user/findland');
        const data = await response.json();
        console.log(data);
        
        if (data.status === 200) {
          setPlantData(data.data.data.landoptimizer.suggested_locations);
        } else {
          setError('Failed to fetch plant data');
        }
      } catch (err) {
        setError('Error connecting to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, []);

  if (loading) {
    return (
      <div className="visualization-info card">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading plant locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="visualization-info card">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!plantData || plantData.length === 0) {
    return (
      <div className="visualization-info card">
        <div className="no-data">
          <i className="fas fa-map-marker-alt"></i>
          <p>No plant locations available</p>
        </div>
      </div>
    );
  }

  // Calculate center of all plants for the map view
  const centerLat = plantData.reduce((sum, plant) => sum + parseFloat(plant.plant_location.latitude), 0) / plantData.length;
  const centerLng = plantData.reduce((sum, plant) => sum + parseFloat(plant.plant_location.longitude), 0) / plantData.length;

  return (
    <div className="visualization-section">
      <div className="section-header">
        <h2>Plant Location Analysis</h2>
        <p>Optimal locations for green hydrogen production facilities</p>
      </div>

      <div className="visualization-content">
        <div className="visualization-info card">
          <h3>Strategic Plant Locations</h3>
          <p>Our analysis identifies optimal locations for green hydrogen production based on multiple factors including proximity to renewable energy sources, land cost, transport infrastructure, and nearby consumers.</p>
          
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
              <span>Production Plants</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#2196F3' }}></div>
              <span>Industrial Consumers</span>
            </div>
          </div>
          
          <div className="plant-selector">
            <label htmlFor="plant-select">Select a plant:</label>
            <select 
              id="plant-select"
              onChange={(e) => setSelectedPlant(plantData[e.target.value])}
              defaultValue=""
            >
              <option value="" disabled>Choose a location</option>
              {plantData.map((plant, index) => (
                <option key={index} value={index}>
                  {plant.plant_location.name}
                </option>
              ))}
            </select>
          </div>
          
          {selectedPlant && (
            <div className="plant-details">
              <h4>{selectedPlant.plant_location.name}</h4>
              <p><strong>Land Required:</strong> {selectedPlant.land_size_required}</p>
              <p><strong>Optimized Cost:</strong> {selectedPlant.optimized_cost_estimate}</p>
              <p><strong>Key Factors:</strong></p>
              <ul>
                {selectedPlant.key_factors_considered.slice(0, 3).map((factor, idx) => (
                  <li key={idx}>{factor.replace(/_/g, ' ')}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="map-visualization card">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={6}
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {plantData.map((plant, index) => (
              <React.Fragment key={index}>
                <Marker
                  position={[parseFloat(plant.plant_location.latitude), parseFloat(plant.plant_location.longitude)]}
                  icon={plantIcon}
                  eventHandlers={{
                    click: () => setSelectedPlant(plant),
                  }}
                >
                  <Popup>
                    <div className="map-popup">
                      <h3>{plant.plant_location.name}</h3>
                      <p><strong>Address:</strong> {plant.plant_location.address}</p>
                      <p><strong>Land Required:</strong> {plant.land_size_required}</p>
                      <p><strong>Optimized Cost:</strong> {plant.optimized_cost_estimate}</p>
                      <button 
                        className="btn-primary"
                        onClick={() => setSelectedPlant(plant)}
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
                
                {plant.nearby_consumers.map((consumer, consumerIndex) => (
                  <Marker
                    key={`consumer-${index}-${consumerIndex}`}
                    position={[parseFloat(consumer.latitude), parseFloat(consumer.longitude)]}
                    icon={consumerIcon}
                  >
                    <Popup>
                      <div className="map-popup">
                        <h3>{consumer.name}</h3>
                        <p><strong>Industry:</strong> {consumer.industry_type}</p>
                        <p><strong>Distance:</strong> {consumer.distance_from_plant}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </React.Fragment>
            ))}
          </MapContainer>
        </div>
      </div>

      <style>
        {`
          .map-visualization {
            padding: 0;
            height: 600px;
            min-height: 350px;
            overflow: hidden;
          }
          
          .map-legend {
            margin: 20px 0;
            padding: 15px;
            background-color: rgba(0, 0, 0, 0.03);
            border-radius: 8px;
          }
          
          .legend-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }
          
          .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            margin-right: 10px;
          }
          
          .plant-selector {
            margin: 20px 0;
          }
          
          .plant-selector label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
          }
          
          .plant-selector select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: white;
          }
          
          .plant-details {
            margin-top: 20px;
            padding: 15px;
            background-color: rgba(76, 175, 80, 0.1);
            border-radius: 8px;
          }
          
          .plant-details h4 {
            margin: 0 0 10px 0;
            color: #2E7D32;
          }
          
          .plant-details p {
            margin: 5px 0;
          }
          
          .plant-details ul {
            margin: 5px 0;
            padding-left: 20px;
          }
          
          .plant-details li {
            text-transform: capitalize;
          }
          
          .map-popup {
            min-width: 200px;
          }
          
          .map-popup h3 {
            margin: 0 0 10px 0;
            color: #2E7D32;
          }
          
          .map-popup p {
            margin: 5px 0;
          }
          
          .loading-spinner, .error-message, .no-data {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 200px;
            color: #757575;
          }
          
          .loading-spinner i, .error-message i, .no-data i {
            font-size: 2rem;
            margin-bottom: 15px;
          }
          
          .error-message i {
            color: #F44336;
          }
          
          .no-data i {
            color: #4CAF50;
          }
        `}
      </style>
    </div>
  );
};

export default PlantLocationMap;