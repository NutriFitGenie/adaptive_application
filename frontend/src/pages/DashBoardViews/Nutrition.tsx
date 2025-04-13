import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RecommendationProps {
  apiBase: string;
  token: string;
}

const Recommendation: React.FC<RecommendationProps> = ({ apiBase, token }) => {
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeeklyPlan = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBase}/api/users/current/weekly-plan`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWeeklyPlan(res.data);
      } catch (error) {
        console.error('Error fetching weekly plan:', error);
      }
      setLoading(false);
    };

    fetchWeeklyPlan();
  }, [apiBase, token]);

  const formatNutrition = (nutrition: any) => {
    return `${nutrition.calories}kcal | P:${nutrition.protein}g C:${nutrition.carbs}g F:${nutrition.fats}g`;
  };

  return (
    <div className="nutrition-container">
      <h3>Your Weekly Nutrition Plan</h3>
      <button onClick={setWeeklyPlan} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh Plan'}
      </button>

      {weeklyPlan && (
        <div className="weekly-plan">
          <div className="plan-summary">
            <h4>Total Weekly Calories: {weeklyPlan.totalCalories}</h4>
            <p>Average Daily: {(weeklyPlan.totalCalories / 7).toFixed(0)}kcal</p>
          </div>

          {weeklyPlan.dailyPlans.map((day: any) => (
            <div key={day.day} className="day-plan">
              <h4>{day.day.charAt(0).toUpperCase() + day.day.slice(1)}</h4>
              
              <div className="meal-card">
                <h5>Breakfast</h5>
                <p className="recipe-name">{day.meals.breakfast.name}</p>
                <p className="nutrition-info">
                  {formatNutrition(day.meals.breakfast.nutritionalInfo)}
                </p>
              </div>

              <div className="meal-card">
                <h5>Lunch</h5>
                <p className="recipe-name">{day.meals.lunch.name}</p>
                <p className="nutrition-info">
                  {formatNutrition(day.meals.lunch.nutritionalInfo)}
                </p>
              </div>

              <div className="meal-card">
                <h5>Dinner</h5>
                <p className="recipe-name">{day.meals.dinner.name}</p>
                <p className="nutrition-info">
                  {formatNutrition(day.meals.dinner.nutritionalInfo)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendation;