import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

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

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const response = await axios.post(
          'https://hackout2025-backend-infinity.onrender.com/api/v1/user/findland',
          {
            data: {
              latitude: 23.45,
              longitude: 78.90,
              capacity: 100
            }
          }
        );

        console.log(response.data);
        const apiData = response.data;

        // Corrected data extraction logic with robust checks
        if (response.status === 200 && apiData?.data?.data?.landoptimizer?.suggested_locations) {
          const fetchedData = apiData.data.data.landoptimizer.suggested_locations;
          setPlantData(fetchedData);
        } else {
          setError('Failed to fetch plant data or data structure is incorrect.');
        }
      } catch (err) {
        console.error("Error fetching plant data:", err);
        setError('Error connecting to the server. Please check the network or API.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, []);

  if (loading) {
    return (
      <div className="map-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading plant locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!plantData || plantData.length === 0) {
    return (
      <div className="map-container">
        <div className="no-data">
          <i className="fas fa-map-marker-alt"></i>
          <p>No plant locations available based on the criteria.</p>
        </div>
      </div>
    );
  }

  // Calculate center of all plants for the map view
  const centerLat = plantData.reduce((sum, plant) => sum + parseFloat(plant.plant_location.latitude), 0) / plantData.length;
  const centerLng = plantData.reduce((sum, plant) => sum + parseFloat(plant.plant_location.longitude), 0) / plantData.length;

  return (
    <div className="map-only-container">
      <style>
        {`
          .map-only-container {
            width: 100%;
            height: 100%;
            position: relative;
          }
          
          .map-container {
            width: 100%;
            height: 600px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f8f9fa;
            border-radius: 8px;
          }
          
          .leaflet-container {
            width: 100%;
            height: 100%;
            border-radius: 8px;
            z-index: 1;
          }
          
          .map-controls {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 1000;
            background: white;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          
          .map-legend {
            display: flex;
            gap: 15px;
            align-items: center;
          }
          
          .legend-item {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
          }
          
          .legend-color {
            width: 15px;
            height: 15px;
            border-radius: 3px;
          }
          
          .loading-spinner, .error-message, .no-data {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #6c757d;
          }
          
          .loading-spinner i, .error-message i, .no-data i {
            font-size: 2rem;
            margin-bottom: 10px;
          }
          
          .loading-spinner i {
            color: #0d6efd;
          }
          
          .error-message i {
            color: #dc3545;
          }
          
          .no-data i {
            color: #198754;
          }
          
          .map-popup {
            min-width: 200px;
          }
          
          .map-popup h3 {
            margin: 0 0 10px 0;
            color: #198754;
            font-size: 16px;
          }
          
          .map-popup p {
            margin: 5px 0;
            font-size: 14px;
          }
          
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
        `}
      </style>
      
      <div className="map-container">
        <div className="map-controls">
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
              <span>Plants</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#2196F3' }}></div>
              <span>Consumers</span>
            </div>
          </div>
        </div>
        
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
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
              >
                <Popup>
                  <div className="map-popup">
                    <h3>{plant.plant_location.name}</h3>
                    <p><strong>Address:</strong> {plant.plant_location.address}</p>
                    <p><strong>Land Required:</strong> {plant.land_size_required}</p>
                    <p><strong>Optimized Cost:</strong> {plant.optimized_cost_estimate}</p>
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
  );
};

export default PlantLocationMap;