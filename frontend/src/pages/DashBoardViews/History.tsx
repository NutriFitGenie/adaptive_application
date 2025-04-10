// History.tsx
import React, { useState, useEffect } from 'react';


const userId = "67f522dae790288113df8b02";

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
      <section className="history px-4 md:px-8 lg:px-16 w-full mx-auto mt-8">
        {exercises.map((ex) => (
          <div key={ex._id} className="exercise-history bg-white border border-gray-200 rounded-md shadow-sm p-4 mb-8">
            <h4 className="text-xl font-semibold text-gray-700 mb-3">{ex.name}</h4>
            {ex.history && ex.history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-auto">
                  <thead className="primaryColor1BG">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Week
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Weight (kg)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Planned Sets
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Actual Sets
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Performance Ratio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ex.history.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-gray-100">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.week}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.weight}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.planned.join(', ')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.actual.join(', ')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.performanceRatio}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.performanceClass}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No history yet.</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default History;