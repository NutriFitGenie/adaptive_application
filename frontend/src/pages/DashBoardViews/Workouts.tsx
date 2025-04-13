import React, { useState, useEffect } from 'react';
import '../../App.css';


interface Exercise {
  _id: string;
  name: string;
  weight: number;
  set1Reps: number;
  set2Reps: number;
  set3Reps: number;
  day: number;
}

interface TestingPlanDay {
  Day: number;
  Exercises: {
    Exercise_id: string;
    name: string;
    description: string;
    category: string;
  }[];
}

const WorkoutDashboard: React.FC = () => {
  const [testingWeekStatus, setTestingWeekStatus] = useState<boolean | undefined>();
  const [testingPlan, setTestingPlan] = useState<TestingPlanDay[]>([]);
  const [testingInputs, setTestingInputs] = useState<{ [key: string]: string }>({});
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const fetchCurrentWeekPlan = async () => {
    try {
      const userdataString = localStorage.getItem("userData");
      const userdata = userdataString ? JSON.parse(userdataString) : null;
      const userId = userdata.id;
      const response = await fetch(`http://localhost:3000/api/workout/getWorkout?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch current week plan");
      const currentPlan = await response.json();
      setExercises(currentPlan);
    } catch (error) {
      console.error("Error fetching current week plan:", error);
    }
  };

  const fetchTestingPlan = async () => {
    try {
      const userdataString = localStorage.getItem("userData");
      const userdata = userdataString ? JSON.parse(userdataString) : null;
      const userId = userdata.id;
      const response = await fetch(`http://localhost:3000/api/workout/generateTestingPlan?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch testing plan");
      const planData = await response.json();
      setTestingPlan(planData);
    } catch (error) {
      console.error("Error fetching testing plan:", error);
    }
  };

  const fetchTestStatus = async () => {
    try {
      const userdataString = localStorage.getItem("userData");
      const userdata = userdataString ? JSON.parse(userdataString) : null;
      const userId = userdata.id;
      const response = await fetch(`http://localhost:3000/api/workout/testStatus?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch test status");
      const statusData = await response.json();
      setTestingWeekStatus(statusData);
    } catch (error) {
      console.error("Error fetching test status:", error);
    }
  };

  useEffect(() => {
    fetchTestStatus();
  }, []);

  useEffect(() => {
    if (testingWeekStatus === true) {
      fetchTestingPlan();
    } else if (testingWeekStatus === false) {
      fetchCurrentWeekPlan();
    }
  }, [testingWeekStatus]);

  const handleTestingInputChange = (dayIndex: number, exerciseIndex: number, value: string) => {
    const key = `${dayIndex}_${exerciseIndex}`;
    setTestingInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitTesting = async () => {
    let hasInvalidInput = false;
    testingPlan.forEach((day, dIndex) => {
      day.Exercises.forEach((ex, eIndex) => {
        const key = `${dIndex}_${eIndex}`;
        const value = testingInputs[key];
        if (!value || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          hasInvalidInput = true;
        }
      });
    });

    if (hasInvalidInput) {
      alert("Please enter a valid positive 1RM value for all exercises.");
      return;
    }

    const updatedPlan = testingPlan.map((day, dIndex) => ({
      Day: day.Day,
      Exercises: day.Exercises.map((ex, eIndex) => {
        const key = `${dIndex}_${eIndex}`;
        return {
          Exercise_id: ex.Exercise_id,
          Exercise: ex.name,
          description: ex.description,
          body_part: ex.category,
          oneRepMax: parseFloat(testingInputs[key]),
        };
      }),
    }));

    try {
      const userdataString = localStorage.getItem("userData");
      const userdata = userdataString ? JSON.parse(userdataString) : null;
      const userId = userdata.id;
      const response = await fetch('http://localhost:3000/api/workout/updateTestingPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updatedPlan }),
      });
      if (!response.ok) throw new Error('Failed to update testing plan');
      await response.json();
      setTestingWeekStatus(false);
    } catch (error) {
      console.error('Error updating testing plan:', error);
    }
  };

  if (testingWeekStatus === undefined) {
    return <div className="App"><p>Loading...</p></div>;
  }

  if (testingWeekStatus === true) {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Skeleton Testing Workout Plan</h2>
          <p>Please enter your One Rep Max (1RM) values for each exercise.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          {testingPlan.map((day, dIndex) => (
            <div key={dIndex} className="bg-white shadow-md rounded-md p-4">
              <h3 className="text-lg font-bold mb-4">Day {day.Day}</h3>
              {day.Exercises.map((ex, eIndex) => {
                const key = `${dIndex}_${eIndex}`;
                return (
                  <div
                    key={key}
                    className="exercise-testing border-t pt-4 mb-4 min-h-[200px] flex flex-col justify-between"
                  >
                    <div className="mb-2">
                      <h4 className="font-semibold">{ex.name}</h4>
                      <p className="text-sm text-gray-700">{ex.description}</p>
                      <a
                        href={`https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(ex.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-sm"
                      >
                        How to Do: Watch on YouTube
                      </a>
                      <p className="text-sm mt-1">Body Part: {ex.category}</p>
                    </div>
                    <label className="mt-2 text-sm">
                      1RM:{" "}
                      <input
                        type="number"
                        min={0}
                        value={testingInputs[key] || ""}
                        onChange={(e) => handleTestingInputChange(dIndex, eIndex, e.target.value)}
                        className="border p-1 rounded w-full"
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <button onClick={handleSubmitTesting} className="mt-6 primaryColor1BG text-white px-4 py-2 rounded cursor-pointer">
          Submit Testing Week
        </button>
      </div>
    );
  }

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
      <div className="mx-auto mt-8 px-4 md:px-8 lg:px-16 w-full">
        {Object.keys(exercisesByDay)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((day, idx) => (
            <div key={day} className="mb-8 bg-white border border-gray-200 rounded-md shadow-sm p-4">
              <h3 className="text-xl font-semibold primaryColor1 mb-3">{`Workout ${idx + 1} (Day ${day})`}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-auto">
                  <thead className="primaryColor1BG">
                    <tr>
                      <th className="px-6 py-3 text-middle text-xs font-medium text-white uppercase tracking-wider">Exercise</th>
                      <th className="px-6 py-3 text-middle text-xs font-medium text-white uppercase tracking-wider">Weight (KG)</th>
                      <th className="px-6 py-3 text-middle text-xs font-medium text-white uppercase tracking-wider">Reps</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {exercisesByDay[day].map((ex) => {
                      const repsString = `${ex.set1Reps} / ${ex.set2Reps} / ${ex.set3Reps}`;
                      return (
                        <tr key={ex._id} className="hover:bg-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm secondaryColor">
                            <div>{ex.name}</div>
                            <a
                              href={`https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(ex.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline text-xs"
                            >
                              How to Do: Link
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm secondaryColor">{ex.weight}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm secondaryColor">{repsString}</td>
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

export default WorkoutDashboard;