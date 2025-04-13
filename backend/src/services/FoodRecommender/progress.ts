import { IUser } from '../../models/user';
import User from '../../models/user';

export class ProgressAnalyzer {
  static async initializeWeek(user: IUser, weekNumber: number): Promise<void> {
    if (user.progress) {
      user.progress.push({
      week: weekNumber,
      weight: user.targetWeight ?? 85, // Initial weight with default value of 0
      bodyFat: 0,
      measurements: {
        waist: 0,
        hips: 0,
        chest: 0
      }
    });
    
    await user.save();
  }
}

  // static async analyzeProgress(user: IUser): Promise<void> {
  //   if (user.progress.length < 2) return;

  //   const currentWeek = user.progress.length;
  //   const current = user.progress[currentWeek - 1];
  //   const previous = user.progress[currentWeek - 2];

  //   // Calculate weight change
  //   const weightChange = current.weight - previous.weight;
  //   const weeklyChange = weightChange / ((currentWeek - 1) * 7); // Average daily change

  //   // Update nutritional requirements
  //   this.adjustNutrition(user, weeklyChange);
    
  //   // Update TDEE based on new weight
  //   user.nutritionalRequirements.tdee = this.calculateTDEE(
  //     user.gender,
  //     current.weight,
  //     user.height,
  //     user.age,
  //     user.activityLevel
  //   );
    
  //   await user.save();
  // }

  private static calculateTDEE(
    gender: any,
    weight: any,
    height: any,
    age: any,
    activityLevel: any
  ): number {
    // Mifflin-St Jeor Equation
    const bmr = (gender === 'male')
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    return bmr * activityMultipliers[activityLevel];
  }

public static adjustNutrition(user: IUser, weeklyChange: number): void {
  const goal = (user.goal ?? 'maintenance') as "weight_loss" | "muscle_gain" | "maintenance";
  const maintenanceCalories = user.nutritionalRequirements.tdee;
  const targetWeight = (user as any).targetWeight 
  // Protein base calculation
  const proteinMultiplier = {
    weight_loss: 2.2,
    muscle_gain: 2.5,
    maintenance: 1.8
  }[goal] ||  1.8;
  const proteinBase = proteinMultiplier * targetWeight;

  // Update all values
  user.nutritionalRequirements = {
    ...user.nutritionalRequirements,
    protein: Math.round(proteinBase),
    carbs: Math.round(proteinBase * 1.5), // Carb ratio
    fats: Math.round(proteinBase * 0.4)    // Fat ratio
  };

  // Calories based on goal
  user.nutritionalRequirements.dailyCalories = Math.round(
    maintenanceCalories + 
    (goal === 'muscle_gain' ? 500 : goal === 'weight_loss' ? -500 : 0)
  );
}

  public static initializeNutrition(user: IUser): void {
    // Calculate BMR
    const bmr = this.calculateTDEE(
      user.gender,
      user.targetWeight, // Use target weight
      user.height,
      user.age,
      user.activityLevel
    );
  
    // Set initial requirements
    user.nutritionalRequirements = {
      bmr: Math.round(bmr),
      tdee: Math.round(bmr),
      dailyCalories: Math.round(bmr),
      protein: 0,
      carbs: 0,
      fats: 0
    };
  
    // Calculate macros
    this.adjustNutrition(user, 0); // Initial adjustment
  }
}