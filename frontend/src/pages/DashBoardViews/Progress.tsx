// src/pages/DashBoardViews/Progress.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface ProgressProps {
  apiBase: string;
  token: string;
  onProgressUpdate: () => void;
}

const Progress: React.FC<ProgressProps> = ({ apiBase, token, onProgressUpdate }) => {
  const [weight, setWeight] = useState<number | ''>('');
  const [bodyFat, setBodyFat] = useState<number | ''>('');
  const [muscleMass, setMuscleMass] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // You might not need userId if it's extracted from token server-side;
      // if needed, adjust accordingly.
      const res = await axios.post(
        `${apiBase}/api/weeklyupdates`,
        { weight, bodyFat, muscleMass },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Progress updated:", res.data);
      onProgressUpdate();
      // Reset form values if desired.
      setWeight('');
      setBodyFat('');
      setMuscleMass('');
    } catch (error) {
      console.error("Error updating progress:", error);
    }
    setLoading(false);
  };

  return (
    <div className="progress-container">
      <h3>Update Weekly Progress</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Weight (kg): </label>
          <input 
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Body Fat (%): </label>
          <input 
            type="number"
            value={bodyFat}
            onChange={(e) => setBodyFat(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Muscle Mass (kg): </label>
          <input 
            type="number"
            value={muscleMass}
            onChange={(e) => setMuscleMass(parseFloat(e.target.value))}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Update Progress'}
        </button>
      </form>
    </div>
  );
};

export default Progress;