// src/data/dataStore.ts

// Define TypeScript interfaces for clarity (optional)
export interface WorkoutPlan {
    workoutName: string;
    exercises: string[];
  }
  
  export interface MealPlan {
    mealType: string;
    calories: number;
    description: string;
  }
  
  export interface DailyPlan {
    workoutPlans: WorkoutPlan[];
    mealPlans: MealPlan[];
  }
  
  // Global data store object keyed by date
  const dataStore: Record<string, DailyPlan> = {
    "2025-03-23": {
      workoutPlans: [
        {
          workoutName: "Chest Day",
          exercises: ["Bench Press (Barbell)", "Dumbbell Fly", "Push Ups"],
        },
        {
          workoutName: "Arm Blast",
          exercises: ["Bicep Curls", "Tricep Dips"],
        },
      ],
      mealPlans: [
        {
          mealType: "Breakfast",
          calories: 400,
          description: "Oats with fruits",
        },
        {
          mealType: "Lunch",
          calories: 650,
          description: "Grilled chicken salad",
        },
        {
          mealType: "Dinner",
          calories: 600,
          description: "Steamed vegetables and salmon",
        },
      ],
    },
    "2025-03-24": {
      workoutPlans: [
        {
          workoutName: "Leg Day",
          exercises: ["Squats", "Lunges", "Leg Press"],
        },
      ],
      mealPlans: [
        {
          mealType: "Breakfast",
          calories: 500,
          description: "Smoothie Bowl",
        },
        {
          mealType: "Lunch",
          calories: 700,
          description: "Quinoa salad with tofu",
        },
        {
          mealType: "Dinner",
          calories: 550,
          description: "Grilled fish with rice",
        },
      ],
    },
  };
  
  export default dataStore;