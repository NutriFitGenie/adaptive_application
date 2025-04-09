import React from "react";

interface HomeProps {
  planData: any;
  previousHistory: { date: string; data: any }[];
  currentDay: string;
}

const Home: React.FC<HomeProps> = ({ planData, previousHistory, currentDay }) => {
  return (
    <>
      <div className="dashboard-grid">
        {/* Today's Workout Plan Card */}
        <div className="plan-card workout-card">
          <h2>Workout Plan for {currentDay}</h2>
          {planData && planData.workoutPlans && planData.workoutPlans.length > 0 ? (
            planData.workoutPlans.map((wp: any, i: number) => (
              <div key={i}>
                <h3>{wp.workoutName}</h3>
                <ul>
                  {wp.exercises.map((ex: string, j: number) => (
                    <li key={j}>{ex}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No workout plan available for {currentDay}.</p>
          )}
          <div className="workout-actions">
            <button className="view-complete-workout">View Complete Workout</button>
            <button className="start-workout">Start Workout</button>
          </div>
        </div>

        {/* Today's Meal Plan Card */}
        <div className="plan-card">
          <h3>Meal Plan for {currentDay}</h3>
          {planData && planData.mealPlans && planData.mealPlans.length > 0 ? (
            planData.mealPlans.map((mp: any, i: number) => (
              <div key={i}>
                <strong>{mp.mealType}</strong>: {mp.description} ({mp.calories} cal)
              </div>
            ))
          ) : (
            <p>No meal plan available for {currentDay}.</p>
          )}
          <div className="workout-actions">
            <button className="view-complete-meal">View Complete Meal</button>
            <button className="start-meal">Start Meal</button>
          </div>
        </div>
      </div>

      {/* Previous History Section */}
      <div className="plan-card history-card">
        <h3>Previous History</h3>
        {previousHistory.length > 0 ? (
          previousHistory.map((entry, index) => {
            const entryDate = new Date(entry.date);
            const formattedEntryDate = entryDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            return (
              <div key={index} className="history-entry">
                <strong>{formattedEntryDate}</strong>
                {entry.data && entry.data.workoutPlans && entry.data.workoutPlans.length > 0 ? (
                  <ul className="history-list">
                    {entry.data.workoutPlans.map((wp: any, i: number) => (
                      <li key={i}>
                        {wp.workoutName} - {wp.exercises.join(", ")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="history-text">No workout data.</p>
                )}
                {entry.data && entry.data.mealPlans && entry.data.mealPlans.length > 0 && (
                  <ul className="history-list">
                    {entry.data.mealPlans.map((mp: any, i: number) => (
                      <li key={i}>
                        <strong>{mp.mealType}</strong>: {mp.description} ({mp.calories} cal)
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        ) : (
          <p>No previous history available.</p>
        )}
      </div>
    </>
  );
};

export default Home;