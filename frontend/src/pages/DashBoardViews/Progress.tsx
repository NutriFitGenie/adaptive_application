import React, { useState, useEffect } from 'react';
import '../../App.css';

const userId = "67f522dae790288113df8b02";

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

interface CombinedProgressProps {
  apiBase: string;
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}

const ProgressAndNutrition: React.FC<CombinedProgressProps> = ({onViewChange }) => {
  // ====== Workout Progress Tracker State & Functions ======
  const [week, setWeek] = useState<number>(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [inputs, setInputs] = useState<{ [key: string]: string[] }>({});
  const [actualWeights, setActualWeights] = useState<{ [key: string]: string }>({});

  // Fetch current week plan and prefill inputs and actualWeights.
  const fetchCurrentWeekPlan = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/workout/getCurrentWorkout?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch current week plan");
      const currentPlan: Exercise[] = await response.json();
      setExercises(currentPlan);
      
      if (currentPlan.length > 0 && currentPlan[0].week !== undefined) {
        setWeek(currentPlan[0].week);
      }

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
      // Refresh the current week plan after submission.
      fetchCurrentWeekPlan();
    } catch (error) {
      console.error("Error submitting day's workout:", error);
      alert("Error saving workout. Please try again");
    }
  };

  // ====== Nutrition / Weekly Progress Form State & Functions ======
  const [formData, setFormData] = useState({
    userId: userId,
    weight: '',
    waist: '',
    otherMeasurements: '',
  });
  const [responseMsg, setResponseMsg] = useState('');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/weeklyprogress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponseMsg(`Weekly progress saved: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setResponseMsg(`Error: ${error.message}`);
    }
  };

  // ====== Combined Render ======
  return (
    <div className="progress-nutrition-component">
      {/* Workout Progress Section */}
      <div className="progress-component">
        <header>
          <h2>Workout Progress Tracker</h2>
          <p>Current Week: {week}</p>
        </header>
        <div className="actual-workout-section">
          {Object.keys(exercisesByDay)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((day) => (
              <div key={day} className="actual-workout-day">
                <h3>{`Workout (Day ${day})`}</h3>
                {exercisesByDay[day].map((ex) => (
                  <div key={ex._id} className="exercise-input">
                    <p>
                      <strong>{ex.name}</strong> (Recommended: {ex.set1Reps}, {ex.set2Reps}, {ex.set3Reps})
                    </p>
                    <label>
                      Weight (KG):
                      <input
                        type="number"
                        min={0}
                        value={actualWeights[ex.name] || String(ex.weight)}
                        onChange={(e) => handleActualWeightChange(ex.name, e.target.value)}
                      />
                    </label>
                    <br />
                    <label>
                      Set 1:
                      <input
                        type="number"
                        min={0}
                        value={(inputs[ex.name] && inputs[ex.name][0]) || ""}
                        onChange={(e) => handleAdaptiveInputChange(ex.name, 0, e.target.value)}
                      />
                    </label>
                    <label>
                      Set 2:
                      <input
                        type="number"
                        min={0}
                        value={(inputs[ex.name] && inputs[ex.name][1]) || ""}
                        onChange={(e) => handleAdaptiveInputChange(ex.name, 1, e.target.value)}
                      />
                    </label>
                    <label>
                      Set 3:
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

      {/* Nutrition / Weekly Progress Section */}
      <div className="weekly-progress-form">
        <h3>Submit Weekly Progress (Nutrition)</h3>
        <form onSubmit={handleFormSubmit}>
          <label>
            User ID:
            <input
              name="userId"
              value={formData.userId}
              onChange={handleFormChange}
              required
            />
          </label>
          <br />
          <label>
            Weight (kg):
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleFormChange}
              required
            />
          </label>
          <br />
          <label>
            Waist (cm):
            <input
              type="number"
              name="waist"
              value={formData.waist}
              onChange={handleFormChange}
            />
          </label>
          <br />
          <label>
            Other Measurements:
            <input
              name="otherMeasurements"
              value={formData.otherMeasurements}
              onChange={handleFormChange}
              placeholder="optional"
            />
          </label>
          <br />
          <button type="submit">Submit Progress</button>
        </form>
        {responseMsg && <pre>{responseMsg}</pre>}
      </div>
    </div>
  );
};

// Provide a named export "Progress" so that the module provides this export.
export const Progress  = ProgressAndNutrition; // This line aliases our component as "Progress"
export default ProgressAndNutrition;