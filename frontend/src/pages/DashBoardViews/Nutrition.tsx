// src/pages/DashBoardViews/Nutrition.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface NutritionProps {
  apiBase: string;   // e.g. "http://localhost:3001"
  token: string;     // JWT token from login
  userId: string;    // The logged-in user's _id
}

const Nutrition: React.FC<NutritionProps> = ({ apiBase, token, userId }) => {
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to fetch the weekly plan from your backend
  const refreshPlan = async (): Promise<void> => {
    setLoading(true);
    try {
      // Example: GET http://localhost:3001/api/food-recommender/<userId>
      const response = await axios.get(`${apiBase}/api/food-recommender/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // The API returns { plan: { ... } } or just the plan itself
      const planData = response.data.plan || response.data;
      console.log("Weekly plan response:", planData);
      setWeeklyPlan(planData);
    } catch (error) {
      console.error("Error fetching weekly plan:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the plan once on mount (and whenever props change)
  useEffect(() => {
    refreshPlan();
  }, [apiBase, token, userId]);

  // Helper: format nutritional info as a string
  const formatNutrition = (nutrition: any): string => {
    if (!nutrition) return "No info";
    return `${nutrition.calories} kcal | Protein: ${nutrition.protein}g, Carbs: ${nutrition.carbs}g, Fats: ${nutrition.fats}g`;
  };

  // Helper: capitalize a string (for day labels, meal types, etc.)
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="nutrition-container">
      <h3>Your Weekly Nutrition Plan</h3>
      <button onClick={refreshPlan} disabled={loading}>
        {loading ? "Loading..." : "Refresh Plan"}
      </button>

      {weeklyPlan ? (
        <div className="weekly-plan">
          <div className="plan-summary">
            <h4>Week Number: {weeklyPlan.weekNumber}</h4>
            <h4>Total Weekly Calories: {weeklyPlan.totalCalories}</h4>
            <p>Week Start: {new Date(weeklyPlan.weekStart).toLocaleString()}</p>
          </div>

          {weeklyPlan.dailyPlans?.map((dayPlan: any) => (
            <div key={dayPlan.day} className="day-plan" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
              <h5>{capitalize(dayPlan.day)}</h5>
              <p><strong>Total Calories for {capitalize(dayPlan.day)}: </strong> {dayPlan.totalCalories}</p>

              {dayPlan.mealIds && dayPlan.mealIds.length > 0 ? (
                dayPlan.mealIds.map((recipe: any, index: number) => {
                  // Some recipe fields might appear in 'mealDetails', or at top level
                  const mealType = recipe.mealDetails?.mealType || recipe.mealType || `Meal ${index + 1}`;
                  const mealName = recipe.mealDetails?.name || recipe.name || '(Unnamed recipe)';
                  const nutrition = recipe.nutritionalInfo;

                  return (
                    <div key={recipe._id} className="meal-card" style={{ marginTop: '10px' }}>
                      <h6>{capitalize(mealType)}</h6>
                      <p className="recipe-name">{mealName}</p>
                      <p className="nutrition-info">{formatNutrition(nutrition)}</p>
                    </div>
                  );
                })
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