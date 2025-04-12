import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
  apiBase: string;
  onLoginSuccess: (token: string, user: any) => void;
  onRegisterClick: () => void;
}

const Login: React.FC<LoginProps> = ({ apiBase, onLoginSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBase}/api/users/login`, {
        email,
        password
      });
      
      onLoginSuccess(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Nutrition Tracker Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="auth-button">
          Login
        </button>

        <p className="auth-switch">
          Don't have an account?{' '}
          <button type="button" onClick={onRegisterClick} className="switch-button">
            Register here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;