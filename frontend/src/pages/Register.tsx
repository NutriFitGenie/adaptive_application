import React, { useState } from 'react';
import axios from 'axios';

interface RegisterProps {
  apiBase: string;
  onRegisterSuccess: (token: string, user: any) => void;
  onLoginClick: () => void;
}

const Register: React.FC<RegisterProps> = ({ apiBase, onRegisterSuccess, onLoginClick }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activityLevel: 'moderate',
    dietaryPreferences: '',
    allergies: '',
    fitnessGoal: 'weight_loss'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBase}/api/users/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        activityLevel: formData.activityLevel,
        dietaryPreferences: formData.dietaryPreferences,
        allergies: formData.allergies,
        fitnessGoal: formData.fitnessGoal
      });
      
      onRegisterSuccess(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };
  return (
    <div className="auth-container">
      <h2>Create New Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>UserName:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Height (cm):</label>
          <input
            type="number"
            step="0.1"
            value={formData.height}
            onChange={(e) => setFormData({...formData, height: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Weight (kg):</label>
          <input
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Activity Level:</label>
          <select
            value={formData.activityLevel}
            onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light Exercise</option>
            <option value="moderate">Moderate Exercise</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
        </div>

        <div className="form-group">
          <label>Dietary Preferences (comma separated):</label>
          <input
            type="text"
            value={formData.dietaryPreferences}
            onChange={(e) => setFormData({...formData, dietaryPreferences: e.target.value})}
            placeholder="e.g., vegetarian, gluten-free"
          />
        </div>

        <div className="form-group">
          <label>Allergies (comma separated):</label>
          <input
            type="text"
            value={formData.allergies}
            onChange={(e) => setFormData({...formData, allergies: e.target.value})}
            placeholder="e.g., nuts, dairy"
          />
        </div>

        <div className="form-group">
          <label>Fitness Goal:</label>
          <select
            value={formData.fitnessGoal}
            onChange={(e) => setFormData({...formData, fitnessGoal: e.target.value})}
          >
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="auth-button">
          Register
        </button>

        <p className="auth-switch">
          Already have an account?{' '}
          <button type="button" onClick={onLoginClick} className="switch-button">
            Login here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;