// src/pages/DashBoardViews/Nutrition.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface NutritionProps {
  apiBase: string;
  token: string;
  userId: string; // Logged-in user's _id
}

const Nutrition: React.FC<NutritionProps> = ({ apiBase, token, userId }) => {
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to refresh the weekly plan by calling the backend API.
  const refreshPlan = async (): Promise<void> => {
    setLoading(true);
    try {
      // Endpoint expects the URL format: /api/food-recommender/<userId>
      const response = await axios.get(`${apiBase}/api/food-recommender/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Depending on your API response structure, either response.data.weeklyPlan or response.data contains the plan.
      setWeeklyPlan(response.data.weeklyPlan || response.data);
    } catch (error) {
      console.error("Error refreshing plan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPlan();
  }, [apiBase, token, userId]);

  // Helper to format nutritional info string.
  const formatNutrition = (nutrition: any): string => {
    if (!nutrition) return 'No info';
    return `${nutrition.calories} kcal | P: ${nutrition.protein}g, C: ${nutrition.carbs}g, F: ${nutrition.fats}g`;
  };

  // Helper to capitalize a string.
  const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="nutrition-container">
      <h3>Your Weekly Nutrition Plan</h3>
      <button onClick={refreshPlan} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh Plan'}
      </button>

      {weeklyPlan ? (
        <div className="weekly-plan">
          <div className="plan-summary">
            <h4>Total Weekly Calories: {weeklyPlan.totalCalories}</h4>
            <p>Average Daily: {(weeklyPlan.totalCalories / 7).toFixed(0)} kcal</p>
          </div>
          {weeklyPlan.dailyPlans.map((day: any) => (
            <div key={day.day} className="day-plan">
              <h4>{capitalize(day.day)}</h4>
              {day.mealIds && day.mealIds.length > 0 ? (
                day.mealIds.map((recipe: any) => (
                  <div key={recipe._id} className="meal-card">
                    <h5>{recipe.mealType ? capitalize(recipe.mealType) : 'Meal'}</h5>
                    <p className="recipe-name">{recipe.name || 'No name available'}</p>
                    <p className="nutrition-info">{formatNutrition(recipe.nutritionalInfo)}</p>
                  </div>
                ))
              ) : (
                <p>No meals for this day.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No weekly plan found.</p>
      )}
    </div>
  );
};

export default Nutrition;