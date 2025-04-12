import React, { useState, useEffect } from 'react';
import '../../App.css';

const userId = "67e1627cebe27e5f8285ec21";

interface Exercise {
  week: number;
  _id: string;
  name: string;
  description: string;
  weight: number;
  set1Reps: number;
  set2Reps: number;
  set3Reps: number;
  day: number;
}

interface WorkoutProps {
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}

const Progress: React.FC<WorkoutProps> = ({ onViewChange }) => {
  const [week, setWeek] = useState<number>(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [inputs, setInputs] = useState<{ [key: string]: string[] }>({});
  const [actualWeights, setActualWeights] = useState<{ [key: string]: string }>({});

  const fetchCurrentWeekPlan = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/workout/getCurrentWorkout?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch current week plan");
      const currentPlan = await response.json();
      setExercises(currentPlan);

      if (currentPlan.length > 0 && currentPlan[0].week !== undefined) {
        setWeek(currentPlan[0].week);
      }

      const weights: { [key: string]: string } = {};
      const repInputs: { [key: string]: string[] } = {};

      currentPlan.forEach((ex: Exercise) => {
        weights[ex.name] = String(ex.weight);
        repInputs[ex.name] = [String(ex.set1Reps), String(ex.set2Reps), String(ex.set3Reps)];
      });

      setActualWeights(weights);
      setInputs(repInputs);
    } catch (error) {
      console.error("Error fetching current week plan:", error);
    }
  };

  useEffect(() => {
    fetchCurrentWeekPlan();
  }, []);

  const handleAdaptiveInputChange = (exerciseName: string, setIndex: number, value: string) => {
    setInputs((prev) => {
      const current = prev[exerciseName] || [];
      const newArr = [...current];
      newArr[setIndex] = value;
      return { ...prev, [exerciseName]: newArr };
    });
  };

  const handleActualWeightChange = (exerciseName: string, value: string) => {
    setActualWeights((prev) => ({ ...prev, [exerciseName]: value }));
  };

  const exercisesByDay = exercises.reduce((acc: { [day: string]: Exercise[] }, ex) => {
    const dayKey = ex.day ? String(ex.day) : "Unknown";
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(ex);
    return acc;
  }, {});

  const handleSubmitDay = async (dayKey: string) => {
    const dayExercises = exercisesByDay[dayKey];
    const exercisesPayload = dayExercises.map((ex: Exercise) => {
      const repsArray = (inputs[ex.name] || []).map((val) => parseInt(val, 10) || 0);
      const weightValue = parseFloat(actualWeights[ex.name]) || ex.weight;
      return {
        Exercise_id: ex._id,
        Exercise: ex.name,
        description: ex.description,
        body_part: ex.day ? ex.day.toString() : "Unknown",
        weight: weightValue,
        set1Reps: repsArray[0],
        set2Reps: repsArray[1],
        set3Reps: repsArray[2],
        week: ex.week,
      };
    });

    const payload = {
      userId,
      updatedPlan: [
        {
          Day: dayKey,
          Exercises: exercisesPayload,
        },
      ],
    };

    try {
      const response = await fetch("http://localhost:3000/api/workout/updateWorkout", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to submit day's workout");
      const result = await response.json();
      console.log("Submit day's workout result:", result);
      alert(`Workout for Day ${dayKey} saved successfully!`);
      fetchCurrentWeekPlan();
    } catch (error) {
      console.error("Error submitting day's workout:", error);
      alert("Error saving workout. Please try again");
    }
  };

  return (
    <div className="App flex justify-center">
      <div className="w-full max-w-4xl mt-8">
        <header className="bg-gray-800 text-white text-center py-6 rounded-t-lg shadow-md">
          <h2 className="text-2xl md:text-3xl font-bold">Workout Progress Tracker</h2>
          <p className="text-sm md:text-base mt-1">Current Week: {week}</p>
        </header>

        {/* ❗ Conditional logic if exercises list is empty */}
        {exercises.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm p-6 text-center text-gray-700 text-lg">
            <p>You have not completed the testing week yet.</p>
            <p>Please proceed to finish it in the <strong>Workouts</strong> section!</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Actual Workout Data</h2>
            {Object.keys(exercisesByDay)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((day) => (
                <div key={day} className="mb-8">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">{`Workout (Day ${day})`}</h3>
                  {exercisesByDay[day].map((ex) => (
                    <div key={ex._id} className="bg-gray-50 p-4 mb-4 rounded border border-gray-200">
                      <p className="font-semibold text-gray-800">
                        {ex.name} <span className="text-sm text-gray-500">(Recommended: {ex.set1Reps}, {ex.set2Reps}, {ex.set3Reps})</span>
                      </p>
                      <div className="mt-2 space-y-2">
                        <label className="block">
                          Weight (KG):{" "}
                          <input
                            type="number"
                            min={0}
                            className="border px-2 py-1 rounded ml-2"
                            value={actualWeights[ex.name] || String(ex.weight)}
                            onChange={(e) => handleActualWeightChange(ex.name, e.target.value)}
                          />
                        </label>
                        <div className="mt-2 space-y-2">
                          {[0, 1, 2].map((i) => (
                          <label key={i} className="block">
                            Set {i + 1} Reps:{" "}
                            <input
                              type="number"
                              min={0}
                              className="border px-2 py-1 rounded ml-2"
                              value={(inputs[ex.name] && inputs[ex.name][i]) || ""}
                              onChange={(e) => handleAdaptiveInputChange(ex.name, i, e.target.value)}
                            />
                          </label>
                        ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => handleSubmitDay(day)}
                    className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700"
                  >
                    Submit Day's Workout
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
