import React, { useState } from 'react';
import axios from 'axios';
import './PlantAssessment.css';

const PlantAssessment = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    location: '', // Changed to string
    current_grey_plant_setup: '',
    land_and_infrastructure: '',
    renewable_energy_source: '',
    water_availability: '',
    storage_and_transport: '',
    end_use_market: '',
    answer: ''
  });
  const [locationMethod, setLocationMethod] = useState('manual');
  const [locationError, setLocationError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Get current location using browser's Geolocation API and convert to address
  const getCurrentLocation = () => {
    setGettingLocation(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Convert coordinates to address using reverse geocoding
          const { latitude, longitude } = position.coords;
          const address = await getAddressFromCoordinates(latitude, longitude);
          
          setFormData({
            ...formData,
            location: address
          });
        } catch (error) {
          console.error('Error getting address:', error);
          setLocationError('Found your location but could not get address. Please enter manually.');
        }
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to retrieve your location. Please enter manually.');
        setGettingLocation(false);
      },
      { timeout: 10000 }
    );
  };

  // Function to get address from coordinates using OpenStreetMap Nominatim
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      } else {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`; // Fallback to coordinates
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`; // Fallback to coordinates
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'locationMethod') {
      setLocationMethod(value);
      if (value === 'current') {
        getCurrentLocation();
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate location data
    if (!formData.location) {
      setLocationError('Please provide location');
      setStep(1);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Get authentication token
      const token = getAuthToken();
      
      if (!token) {
        console.error('No authentication token found');
        setSubmitting(false);
        // You might want to redirect to login here
        return;
      }
      
      // Prepare data in the exact format required
      const submissionData = {
        location: formData.location, // Now a string
        current_grey_plant_setup: formData.current_grey_plant_setup,
        land_and_infrastructure: formData.land_and_infrastructure,
        renewable_energy_source: formData.renewable_energy_source,
        water_availability: formData.water_availability,
        storage_and_transport: formData.storage_and_transport,
        end_use_market: formData.end_use_market,
        answer: formData.answer
      };
      
      // Make API request with authentication header
      await axios.post(
        'https://hackout2025-backend-infinity.onrender.com/api/v1/user/saveoldplantdata', 
        submissionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Simulate API call for demonstration
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        // You might want to redirect to login here
      }
      
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validate location data before proceeding
    if (step === 1 && !formData.location) {
      setLocationError('Please provide location');
      return;
    }
    setStep(step + 1);
    setLocationError('');
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      location: '',
      current_grey_plant_setup: '',
      land_and_infrastructure: '',
      renewable_energy_source: '',
      water_availability: '',
      storage_and_transport: '',
      end_use_market: '',
      answer: ''
    });
    setLocationMethod('manual');
    setLocationError('');
    setSubmitted(false);
  };

  // Check if user is authenticated on component mount
  React.useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      // Redirect to login or show error
      console.error('User not authenticated');
      // You might want to redirect to login here
    }
  }, []);

  // Render different sections based on current step
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="form-section">
            <h2>Location Information</h2>
            
            <div className="location-method-selector">
              <label>How would you like to provide location?</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="locationMethod"
                    value="current"
                    checked={locationMethod === 'current'}
                    onChange={handleChange}
                  />
                  <span>Use my current location</span>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="locationMethod"
                    value="manual"
                    checked={locationMethod === 'manual'}
                    onChange={handleChange}
                  />
                  <span>Enter address manually</span>
                </label>
              </div>
            </div>
            
            {gettingLocation && (
              <div className="location-loading">
                <div className="location-spinner"></div>
                <p>Getting your location and address...</p>
              </div>
            )}
            
            {locationMethod === 'manual' && (
              <div className="manual-location">
                <div className="input-group">
                  <label>Plant Location Address</label>
                  <textarea
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter the full address of your plant location"
                    rows="3"
                    required
                  />
                </div>
              </div>
            )}
            
            {locationError && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {locationError}
              </div>
            )}
            
            {formData.location && (
              <div className="location-preview">
                <p>Selected Location:</p>
                <div className="location-address">
                  {formData.location}
                </div>
              </div>
            )}
            
            <div className="button-group">
              <button type="button" onClick={nextStep} className="btn-next" disabled={gettingLocation}>
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-section">
            <h2>Current Plant Setup</h2>
            <div className="input-group">
              <label>Current Grey Plant Setup</label>
              <textarea
                name="current_grey_plant_setup"
                value={formData.current_grey_plant_setup}
                onChange={handleChange}
                placeholder="Describe your current plant setup"
                rows="4"
                required
              />
            </div>
            <div className="button-group">
              <button type="button" onClick={prevStep} className="btn-prev">
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button type="button" onClick={nextStep} className="btn-next">
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-section">
            <h2>Infrastructure & Energy</h2>
            <div className="input-group">
              <label>Land and Infrastructure</label>
              <textarea
                name="land_and_infrastructure"
                value={formData.land_and_infrastructure}
                onChange={handleChange}
                placeholder="Describe available land and infrastructure"
                rows="3"
                required
              />
            </div>
            <div className="input-group">
              <label>Renewable Energy Sources</label>
              <textarea
                name="renewable_energy_source"
                value={formData.renewable_energy_source}
                onChange={handleChange}
                placeholder="Describe available renewable energy sources"
                rows="3"
                required
              />
            </div>
            <div className="button-group">
              <button type="button" onClick={prevStep} className="btn-prev">
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button type="button" onClick={nextStep} className="btn-next">
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-section">
            <h2>Resources & Market</h2>
            <div className="input-group">
              <label>Water Availability</label>
              <textarea
                name="water_availability"
                value={formData.water_availability}
                onChange={handleChange}
                placeholder="Describe water availability"
                rows="3"
                required
              />
            </div>
            <div className="input-group">
              <label>Storage and Transport</label>
              <textarea
                name="storage_and_transport"
                value={formData.storage_and_transport}
                onChange={handleChange}
                placeholder="Describe storage and transport capabilities"
                rows="3"
                required
              />
            </div>
            <div className="input-group">
              <label>End Use Market</label>
              <textarea
                name="end_use_market"
                value={formData.end_use_market}
                onChange={handleChange}
                placeholder="Describe your end use market"
                rows="3"
                required
              />
            </div>
            <div className="button-group">
              <button type="button" onClick={prevStep} className="btn-prev">
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button type="submit" className="btn-submit">
                Submit Assessment
              </button>
            </div>
          </div>
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  if (submitting) {
    return (
      <div className="assessment-container">
        <div className="processing-animation">
          <div className="loader"></div>
          <h2>Processing Your Information</h2>
          <p>Our system is analyzing your plant setup data...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="assessment-container">
        <div className="success-animation">
          <div className="checkmark">✓</div>
          <h2>Assessment Submitted Successfully!</h2>
          <p>We've received your query and our system has started processing it. We'll email you once the analysis is complete.</p>
          <button onClick={()=>window.location.href = '/dashboard'} className="btn-home">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <h1>Green Plant Setup Assessment</h1>
        <p>Help us understand your current setup to provide the best transformation plan</p>
      </div>
      
      <div className="progress-bar">
        <div className="progress" style={{width: `${(step / 4) * 100}%`}}></div>
        <div className="step-indicator">Step {step} of 4</div>
      </div>
      
      <form onSubmit={handleSubmit} className="assessment-form">
        {renderStep()}
      </form>
    </div>
  );
};

export default PlantAssessment;