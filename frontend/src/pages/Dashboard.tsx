import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nutrition from './DashBoardViews/Nutrition';
import WeeklyProgressForm from './DashBoardViews/Progress';
import { IUser } from './DashBoardViews/types'; // Define proper user interface
interface DashboardProps {
  apiBase: string;
  token: string;
  user: IUser;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ apiBase, token, user, onLogout }) => {
  const [userData, setUserData] = useState<IUser>(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchUserData = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiBase}/api/food-recommender/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data.user);
    } catch (err) {
      setError('Failed to load user data. Please try refreshing.');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  }, [apiBase, token, user._id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={fetchUserData}>Retry</button>
      </div>
    );
  }

  const currentWeight = userData.progress.length > 0 
    ? userData.progress[userData.progress.length - 1].weight
    : '-';

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome, {userData.name || 'User'}</h2>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="user-stats">
        <div className="stat-card">
          <h4>Current Week</h4>
          <p>Week {userData.progress.length || 1}</p>
        </div>
        
        <div className="stat-card">
          <h4>Current Weight</h4>
          <p>{currentWeight} kg</p>
        </div>

        <div className="stat-card">
          <h4>Daily Calories</h4>
          <p>{userData.nutritionalRequirements?.dailyCalories || 0}kcal</p>
        </div>
      </div>

      <Nutrition apiBase={apiBase} token={token} />
      <WeeklyProgressForm apiBase={apiBase} token={token} />
    </div>
  );
};

export default Dashboard;