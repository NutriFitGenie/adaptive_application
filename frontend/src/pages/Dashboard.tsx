import React from 'react';
import UserForm from './DashBoardViews/UserForm';
import Recommendation from './DashBoardViews/Nutrition';
import WeeklyProgressForm from './DashBoardViews/Progress';

interface DashboardProps {
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const API_BASE = 'http://localhost:3000/api';  // Adjust if needed

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <p>Your user is logged in. Below are forms to test the recommender system.</p>

      {/* 1. Submit or update user info */}
      <UserForm apiBase={API_BASE} />

      {/* 2. Get recipe recommendations */}
      <Recommendation apiBase={API_BASE} />

      {/* 3. Submit weekly progress updates */}
      <WeeklyProgressForm apiBase={API_BASE} />

      <button
        onClick={() => {
          localStorage.removeItem('token');
          onViewChange('login');
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;