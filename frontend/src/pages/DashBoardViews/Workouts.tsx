// PlannedWorkoutsPage.tsx
import React, { useState, useEffect } from 'react';
// import '../../App.css';

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
      {/* Changed container: removed max-w-screen-lg so desktop takes full width */}
      <div className="mx-auto mt-8 px-4 md:px-8 lg:px-16 w-full">
        {Object.keys(exercisesByDay)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((day, idx) => (
            <div key={day} className="mb-8 bg-white border border-gray-200 rounded-md shadow-sm p-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">{`Workout ${idx + 1} (Day ${day})`}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-auto">
                  <thead className="primaryColor1BG">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Exercise
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Weight (KG)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Reps
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {exercisesByDay[day].map((ex) => {
                      const repsString = `${ex.set1Reps} / ${ex.set2Reps} / ${ex.set3Reps}`;
                      return (
                        <tr key={ex._id} className="hover:bg-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ex.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ex.weight}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{repsString}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Workouts;