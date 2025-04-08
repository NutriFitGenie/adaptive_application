// PlannedWorkoutsPage.tsx
import React, { useState, useEffect } from 'react';
import '../../App.css';

const userId = "67e1627cebe27e5f8285ec21";

interface Exercise {
  _id: string;
  name: string;
  weight: number;
  set1Reps: number;
  set2Reps: number;
  set3Reps: number;
  day: number;
}
interface WorkoutProps {
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}
const Workouts: React.FC<WorkoutProps> = ({ onViewChange }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const fetchCurrentWeekPlan = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/workout/getWorkout?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch current week plan");
      const currentPlan = await response.json();
      setExercises(currentPlan);
    } catch (error) {
      console.error("Error fetching current week plan:", error);
    }
  };

  useEffect(() => {
    fetchCurrentWeekPlan();
  }, []);

  // Group exercises by day.
  const exercisesByDay = exercises.reduce((acc: { [day: string]: Exercise[] }, ex) => {
    const dayKey = ex.day ? String(ex.day) : "Unknown";
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(ex);
    return acc;
  }, {});

  return (
    <div className="App">
      <header className="App-header">
        <h2>Planned Workouts</h2>
      </header>
      <div className="planned-workout-section">
        {Object.keys(exercisesByDay)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((day, idx) => (
            <div key={day} className="planned-workout-day">
              <h3>{`Workout ${idx + 1} (Day ${day})`}</h3>
              <table className="planned-workout-table">
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Weight (KG)</th>
                    <th>Reps</th>
                  </tr>
                </thead>
                <tbody>
                  {exercisesByDay[day].map((ex) => {
                    const repsString = `${ex.set1Reps} / ${ex.set2Reps} / ${ex.set3Reps}`;
                    return (
                      <tr key={ex._id}>
                        <td>{ex.name}</td>
                        <td>{ex.weight}</td>
                        <td>{repsString}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Workouts;
