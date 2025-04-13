import React, { useState, useEffect } from "react";


interface HomeProps {
  planData: any;
  currentDay: string;
  onViewChange: (view: "login" | "register" | "dashboard" | "workouts" | "nutrition" | "progress" | "history" | "setting") => void;
}

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

interface PlannedExercise {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  weight: number;
  set1Reps: number;
  set2Reps: number;
  set3Reps: number;
  oneRepMax?: number;
  week: number;
  day: number;
}

const Home: React.FC<HomeProps> = ({ planData, currentDay, onViewChange }) => {
  // State for current workout plan fetched from /getCurrentWorkout API
  const [currentWorkout, setCurrentWorkout] = useState<PlannedExercise[]>([]);
  const [loadingWorkout, setLoadingWorkout] = useState<boolean>(false);
  const [workoutError, setWorkoutError] = useState<string>("");

  // State for fetched workout history (from API)
  const [fetchedHistory, setFetchedHistory] = useState<ExerciseWithHistory[]>([]);

  // Fetch current workout plan from /getCurrentWorkout endpoint.
  const fetchCurrentWorkout = async () => {
    setLoadingWorkout(true);
    setWorkoutError("");
    try {
      const userdataString = localStorage.getItem("userData");
      const userdata = userdataString ? JSON.parse(userdataString) : null;
      const userId = userdata.id;
      const response = await fetch(`http://localhost:3000/api/workout/getCurrentWorkout?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch current workout plan");
      const data: PlannedExercise[] = await response.json();
      setCurrentWorkout(data);
    } catch (error) {
      console.error("Error fetching current workout plan:", error);
      setWorkoutError("Unable to load current workout plan.");
    } finally {
      setLoadingWorkout(false);
    }
  };

  // Fetch current workout plan on mount.
  useEffect(() => {
    fetchCurrentWorkout();
  }, []);

  // Fetch workout history using the same logic as before.
  const fetchWorkoutHistory = async () => {
    try {
      const userdataString = localStorage.getItem("userData");
      const userdata = userdataString ? JSON.parse(userdataString) : null;
      const userId = userdata.id;
      const response = await fetch(`http://localhost:3000/api/workout/getWorkout?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch workout history");
      }
      const historyData = await response.json();
      setFetchedHistory(historyData);
    } catch (error) {
      console.error("Error fetching workout history:", error);
    }
  };

  useEffect(() => {
    fetchWorkoutHistory();
  }, []);

  return (
    <>
      <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Workout Plan Card */}
        <div className="plan-card workout-card bg-white border border-gray-200 rounded-md shadow-sm p-4">
          <h2 className="text-2xl font-bold mb-4">Workout Plan for {currentDay}</h2>
          {loadingWorkout ? (
            <p>Loading workout plan...</p>
          ) : workoutError ? (
            <p className="text-red-500">{workoutError}</p>
          ) : currentWorkout && currentWorkout.length > 0 ? (
            currentWorkout.map((exercise) => (
              <div key={exercise._id} className="mb-4">
                <h3 className="text-xl font-semibold">{exercise.name}</h3>
                {exercise.description && <p>{exercise.description}</p>}
                <ul className="list-disc ml-5">
                  <li>Category: {exercise.category}</li>
                  <li>Weight: {exercise.weight} KG</li>
                </ul>
              </div>
            ))
          ) : (
            <p>No workout plan available for {currentDay}.</p>
          )}
          <div className="workout-actions mt-4 flex gap-2">
            <button
              className="view-complete-workout px-4 py-2 bg-primaryColor1 text-white rounded-md"
              onClick={() => {
                onViewChange("workouts")}}
            >
              View Complete Workout
            </button>
            <button className="start-workout px-4 py-2 bg-primaryColor2 text-white rounded-md"
            onClick={() => {
              onViewChange("progress")}}>
              Start Workout
            </button>
          </div>
        </div>

        {/* Today's Meal Plan Card */}
        <div className="plan-card bg-white border border-gray-200 rounded-md shadow-sm p-4">
          <h3 className="text-2xl font-bold mb-4">Meal Plan for {currentDay}</h3>
          {planData && planData.mealPlans && planData.mealPlans.length > 0 ? (
            planData.mealPlans.map((mp: any, i: number) => (
              <div key={i} className="mb-3">
                <p className="text-base">
                  <strong>{mp.mealType}</strong>: {mp.description} ({mp.calories} cal)
                </p>
              </div>
            ))
          ) : (
            <p>No meal plan available for {currentDay}.</p>
          )}
          <div className="workout-actions mt-4 flex gap-2">
            <button className="view-complete-meal px-4 py-2 bg-primaryColor1 text-white rounded-md">
              View Complete Meal
            </button>
            <button className="start-meal px-4 py-2 bg-primaryColor2 text-white rounded-md">
              Start Meal
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default Home;