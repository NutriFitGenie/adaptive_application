import React, { useState } from 'react';
import axios from 'axios';

interface WeeklyProgressFormProps {
  apiBase: string;
  token: string;
}

const WeeklyProgressForm: React.FC<WeeklyProgressFormProps> = ({ apiBase, token }) => {
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    waist: '',
    hips: '',
    chest: ''
  });
  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBase}/api/users/progress`, {
        metrics: {
          weight: parseFloat(formData.weight),
          bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
          measurements: {
            waist: parseFloat(formData.waist),
            hips: parseFloat(formData.hips),
            chest: parseFloat(formData.chest)
          }
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setResponseMsg(`Weekly progress updated! New recommendations generated for week ${res.data.week}`);
    } catch (error: any) {
      setResponseMsg(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="progress-form">
      <h3>Weekly Progress Update</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Weight (kg):
            <input
              type="number"
              step="0.1"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Body Fat (%):
            <input
              type="number"
              step="0.1"
              name="bodyFat"
              value={formData.bodyFat}
              onChange={handleChange}
            />
          </label>
        </div>

        <h4>Body Measurements (cm)</h4>
        <div className="form-group">
          <label>
            Waist:
            <input
              type="number"
              step="0.1"
              name="waist"
              value={formData.waist}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Hips:
            <input
              type="number"
              step="0.1"
              name="hips"
              value={formData.hips}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Chest:
            <input
              type="number"
              step="0.1"
              name="chest"
              value={formData.chest}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Submit Progress
        </button>
      </form>

      {responseMsg && (
        <div className="response-message">
          {responseMsg.includes("Error") ? (
            <p className="error">{responseMsg}</p>
          ) : (
            <p className="success">{responseMsg}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyProgressForm;