// Progress.tsx
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

const Progress: React.FC<WorkoutProps> = ({ onViewChange }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [inputs, setInputs] = useState<{ [key: string]: string[] }>({});
  const [actualWeights, setActualWeights] = useState<{ [key: string]: string }>({});

  // Fetch current week plan and prefill inputs and actualWeights.
  const fetchCurrentWeekPlan = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/workout/getWorkout?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch current week plan");
      const currentPlan = await response.json();
      setExercises(currentPlan);
      // Prefill actualWeights with planned weight.
      const weights: { [key: string]: string } = {};
      currentPlan.forEach((ex: Exercise) => {
        weights[ex.name] = String(ex.weight);
      });
      setActualWeights(weights);
      // Prefill rep inputs.
      const repInputs: { [key: string]: string[] } = {};
      currentPlan.forEach((ex: Exercise) => {
        repInputs[ex.name] = [String(ex.set1Reps), String(ex.set2Reps), String(ex.set3Reps)];
      });
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

  // Group exercises by day.
  const exercisesByDay = exercises.reduce((acc: { [day: string]: Exercise[] }, ex) => {
    const dayKey = ex.day ? String(ex.day) : "Unknown";
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(ex);
    return acc;
  }, {});

  // Function to submit the workout for a specific day.
  const handleSubmitDay = async (dayKey: string) => {
    const dayExercises = exercisesByDay[dayKey];
    const workoutData = dayExercises.map((ex: Exercise) => {
      // Map input reps to numbers.
      const reps = (inputs[ex.name] || []).map((val) => parseInt(val, 10) || 0);
      const weight = parseFloat(actualWeights[ex.name]) || ex.weight;
      return {
        exerciseId: ex._id,
        name: ex.name,
        actualWeight: weight,
        actualReps: reps,
      };
    });
    const payload = { userId, day: dayKey, workouts: workoutData };
    try {
      const response = await fetch("http://localhost:3000/api/workout/submitWorkout", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to submit day's workout");
      const result = await response.json();
      console.log("Submit day's workout result:", result);
      alert(`Workout for Day ${dayKey} saved successfully!`);
    } catch (error) {
      console.error("Error submitting day's workout:", error);
      alert("Error saving workout. Please try again");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Workout Progress Tracker</h2>
      </header>
      <div className="actual-workout-section">
        <h2>Enter Your Actual Workout Data</h2>
        {Object.keys(exercisesByDay)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((day, idx) => (
            <div key={day} className="actual-workout-day">
              <h3>{`Workout ${idx + 1} (Day ${day})`}</h3>
              {exercisesByDay[day].map((ex) => (
                <div key={ex._id} className="exercise-input">
                  <p>
                    <strong>{ex.name}</strong> (Recommended: {ex.set1Reps}, {ex.set2Reps}, {ex.set3Reps})
                  </p>
                  <label>
                    Weight (KG):{" "}
                    <input
                      type="number"
                      min={0}
                      value={actualWeights[ex.name] || String(ex.weight)}
                      onChange={(e) => handleActualWeightChange(ex.name, e.target.value)}
                    />
                  </label>
                  <br />
                  <label>
                    Set 1:{" "}
                    <input
                      type="number"
                      min={0}
                      value={(inputs[ex.name] && inputs[ex.name][0]) || ""}
                      onChange={(e) => handleAdaptiveInputChange(ex.name, 0, e.target.value)}
                    />
                  </label>
                  <label>
                    Set 2:{" "}
                    <input
                      type="number"
                      min={0}
                      value={(inputs[ex.name] && inputs[ex.name][1]) || ""}
                      onChange={(e) => handleAdaptiveInputChange(ex.name, 1, e.target.value)}
                    />
                  </label>
                  <label>
                    Set 3:{" "}
                    <input
                      type="number"
                      min={0}
                      value={(inputs[ex.name] && inputs[ex.name][2]) || ""}
                      onChange={(e) => handleAdaptiveInputChange(ex.name, 2, e.target.value)}
                    />
                  </label>
                </div>
              ))}
              <button onClick={() => handleSubmitDay(day)}>Submit Day's Workout</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Progress;
