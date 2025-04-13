// src/types.ts
export interface IUser {
    _id: string;
    name:string;
    email: string;
    personalInfo: {
      age: number;
      gender: 'male' | 'female' | 'other';
      height: number;
      activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    };
    preferences: {
      dietary: string[];
      allergies: string[];
      excludedIngredients: string[];
      cuisinePreferences: string[];
    };
    fitnessGoals: {
      goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
      targetWeight: number;
      timeframeWeeks: number;
    };
    nutritionalRequirements: {
      bmr: number;
      tdee: number;
      dailyCalories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
    progress: Array<{
      week: number;
      weight: number;
      bodyFat?: number;
      measurements?: {
        waist: number;
        hips: number;
        chest: number;
      };
    }>;
    weeklyPlans: string[]; // Array of WeeklyPlan IDs
    preferredRecipes: string[]; // Array of Recipe IDs
    createdAt: string;
  }
  
  export interface WeeklyPlan {
    _id: string;
    weekNumber: number;
    dailyPlans: Array<{
      day: string;
      meals: {
        breakfast: Recipe;
        lunch: Recipe;
        dinner: Recipe;
      };
    }>;
  }
  
  export interface Recipe {
    _id: string;
    name: string;
    nutritionalInfo: {
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
    // Add other recipe properties as needed
  }