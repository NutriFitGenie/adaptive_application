// History.tsx
import React, { useState, useEffect } from 'react';
import '../../App.css';

const userId = "67e1627cebe27e5f8285ec21";

interface HistoryEntry {
  week: number;
  weight: number;
  planned: number[];
  actual: number[];
  performanceRatio: string;
  performanceClass: string;
}

interface ExerciseWithHistory {
  _id: string;
  name: string;
  history?: HistoryEntry[];
}

interface WorkoutProps {
    onViewChange: (view: "login" | "register" | "dashboard") => void;
  }

const History: React.FC<WorkoutProps> = ({ onViewChange }) => {
  const [exercises, setExercises] = useState<ExerciseWithHistory[]>([]);

  const fetchWorkoutHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/workout/getWorkout?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch workout history");
      const currentPlan = await response.json();
      setExercises(currentPlan);
    } catch (error) {
      console.error("Error fetching workout history:", error);
    }
  };

  useEffect(() => {
    fetchWorkoutHistory();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Workout History</h2>
      </header>
      <section className="history">
        {exercises.map((ex) => (
          <div key={ex._id} className="exercise-history">
            <h4>{ex.name}</h4>
            {ex.history && ex.history.length > 0 ? (
              <table border={1} cellPadding={5}>
                <thead>
                  <tr>
                    <th>Week</th>
                    <th>Weight (kg)</th>
                    <th>Planned Sets</th>
                    <th>Actual Sets</th>
                    <th>Performance Ratio</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {ex.history.map((entry, idx) => (
                    <tr key={idx}>
                      <td>{entry.week}</td>
                      <td>{entry.weight}</td>
                      <td>{entry.planned.join(', ')}</td>
                      <td>{entry.actual.join(', ')}</td>
                      <td>{entry.performanceRatio}</td>
                      <td>{entry.performanceClass}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No history yet.</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default History;
