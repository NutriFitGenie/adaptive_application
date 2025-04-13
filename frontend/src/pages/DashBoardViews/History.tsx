import React, { useState, useEffect } from 'react';



interface HistoryEntry {
  week: number;
  plannedWeight: number;
  actualWeight: number;
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
      const userdataString = localStorage.getItem("userData");
      const userdata = userdataString ? JSON.parse(userdataString) : null;
      const userId = userdata.id;
      const response = await fetch(`http://localhost:3000/api/workout/getWorkoutHistory?userId=${userId}`);
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
    <div className="App flex justify-center">
      <div className="w-full mt-8">
        {/* Responsive and aligned header */}
        <div className="primaryColor1BG text-white text-center py-6 rounded-t-lg shadow-md">
          <h2 className="text-2xl md:text-3xl font-bold">Workout History</h2>
          <p className="text-sm md:text-base mt-1">Your Weekly Performance History</p>
        </div>

        {/* Workout history section */}
        <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm p-4">
          {exercises.length === 0 && (
            <p className="text-gray-600">No history yet.</p>
          )}

          {exercises.map((ex) => (
            <div key={ex._id} className="mb-8">
              <h4 className="text-xl font-semibold text-gray-700 mb-3">{ex.name}</h4>
              {ex.history && ex.history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Week</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Planned Weight (kg)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actual Weight (kg)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Planned Sets</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actual Sets</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Performance Ratio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ex.history.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.week}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.plannedWeight}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.actualWeight}</td>
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
                <p className="text-gray-600">No data available for this exercise.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;