import { IUser } from '../../models/UserModel'; // Verify your path

export class ProgressAnalyzer {
  static analyzeProgress(user: IUser): void {
    if (user.progress.length < 2) return;

    const latest = user.progress[user.progress.length - 1];
    const previous = user.progress[user.progress.length - 2];
    
    const weightChange = latest.weight - previous.weight;
    const weeklyChange = weightChange / ((latest.date.getTime() - previous.date.getTime()) / (1000 * 3600 * 24 * 7));

    this.adjustNutrition(user, weeklyChange);
  }

  private static adjustNutrition(user: IUser, weeklyChange: number): void {
    const current = user.nutritionalRequirements;
    
    // Calorie adjustments
    const calorieAdjustment = this.calculateCalorieAdjustment(user, weeklyChange);
    current.dailyCalories = Math.max(current.dailyCalories + calorieAdjustment, 1200);

    // Macronutrient prioritization
    switch(user.fitnessGoals.goal) {
      case 'weight_loss':
        current.protein = Math.min(current.protein * 1.05, 150);
        current.carbs = Math.max(current.carbs * 0.95, 100);
        break;
      case 'muscle_gain':
        current.protein = Math.min(current.protein * 1.1, 200);
        current.fats = Math.min(current.fats * 1.05, 80);
        break;
      case 'maintenance':
        current.protein *= 1.02;
        current.carbs *= 0.98;
        break;
    }

    user.markModified('nutritionalRequirements');
    user.save();
  }

  private static calculateCalorieAdjustment(user: IUser, weeklyChange: number): number {
    switch(user.fitnessGoals.goal) {
      case 'weight_loss':
        return weeklyChange > -0.5 ? -100 : 0;
      case 'muscle_gain':
        return weeklyChange < 0.3 ? 200 : 0;
      case 'maintenance':
        return Math.abs(weeklyChange) > 0.2 ? (weeklyChange > 0 ? -50 : 50) : 0;
      default:
        return 0;
    }
  }
}