import React, { useState } from 'react';
import './HousePricePredictor.css';

function HousePricePredictor() {
  const [formData, setFormData] = useState({
    city: '',
    province: '',
    latitude: '',
    longitude: '',
    lease_term: '',
    type: '',
    beds: '',
    baths: '',
    sq_feet: '',
    furnishing: 'Unfurnished',
    smoking: '',
    pets: false
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    try {
      const response = await fetch('/predict_house_price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        setPrediction(data.predicted_rent);
      } else {
        const data = await response.json();
        setError(data.message || 'Prediction failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="predictor-container">
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>City</label>
          <input type="text" name="city" required value={formData.city} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Province</label>
          <input type="text" name="province" required value={formData.province} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Latitude</label>
          <input type="number" name="latitude" required value={formData.latitude} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Longitude</label>
          <input type="number" name="longitude" required value={formData.longitude} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Lease Term</label>
          <input type="text" name="lease_term" required value={formData.lease_term} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Type of House</label>
          <input type="text" name="type" required value={formData.type} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Number of Beds</label>
          <input type="number" name="beds" required value={formData.beds} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Number of Baths</label>
          <input type="number" name="baths" required value={formData.baths} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Square Feet</label>
          <input type="number" name="sq_feet" required value={formData.sq_feet} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Furnishing</label>
          <select name="furnishing" required value={formData.furnishing} onChange={handleChange}>
            <option value="Unfurnished">Unfurnished</option>
            <option value="Partially Furnished">Partially Furnished</option>
            <option value="Fully Furnished">Fully Furnished</option>
          </select>
        </div>
        <div className="form-field">
          <label>Smoking</label>
          <input type="text" name="smoking" required value={formData.smoking} onChange={handleChange} placeholder="Yes/No" />
        </div>
        <div className="form-field checkbox-field">
          <input type="checkbox" name="pets" checked={formData.pets} onChange={handleChange} />
          <label>Pets</label>
        </div>
        <button type="submit">Predict Rent</button>
      </form>
      {error && <div className="error">{error}</div>}
      {prediction !== null && (
        <div className="prediction-result">
          Predicted Rental Price: <strong>{prediction}</strong>
        </div>
      )}
    </div>
  );
}

export default HousePricePredictor;
