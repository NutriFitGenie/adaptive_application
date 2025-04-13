import { IUser } from "../../models/UserModel";
import { IRecipe } from "../../models/recipe";
import Recipe from "../../models/recipe";
import User from "../../models/UserModel";
import { ProgressAnalyzer } from "./progress";
import WeeklyPlan from "../../models/WeeklyPlan";
import { ObjectId } from "mongoose";
import { MemoryManager } from "../../utils/memoryManager";

export class RecommenderEngine {
  private user: IUser;
  private allRecipes: IRecipe[];

  constructor(user: IUser, recipes: IRecipe[]) {
    this.user = user;
    this.allRecipes = recipes.filter(
      (recipe) =>
        recipe?.nutritionalInfo &&
        typeof recipe.nutritionalInfo.calories === "number" &&
        typeof recipe.nutritionalInfo.protein === "number"
    );
    console.log(this.allRecipes.length, "valid recipes found");
    
  }
  private async processInBatches(recipes: IRecipe[]): Promise<IRecipe[]> {
    const MIN_SCORE = 20; // Minimum acceptable score

    const scored = recipes
      .filter((recipe) => recipe?._id && recipe.nutritionalInfo)
      .map((recipe) => ({
        ...recipe.toObject(),
        score:
          this.calculateMacroScore(recipe) + this.calculateGoalScore(recipe),
      }))
      .filter((item) => item.score >= MIN_SCORE);

    return scored.sort((a, b) => b.score - a.score).slice(0, 50);
  }

  private filterRecipes(): IRecipe[] {
    const allergySet = new Set(
      this.user.allergies?.map(a => a.toLowerCase()) || []
    );
    
    const dietarySet = new Set(
      this.user.dietaryPreferences?.map(d => d.toLowerCase()) || []
    );
  
    return this.allRecipes.filter(recipe => {
      if (!recipe.nutritionalInfo) return false;
  
      // CORRECTED: Check recipe's allergens array instead of ingredients
      const hasAllergens = (recipe.allergens || []).some(allergen => 
        allergySet.has(allergen.toLowerCase())
      );
  
      // Match ANY dietary tag if user has preferences
      const matchesDietary = dietarySet.size === 0 || 
        (recipe.dietaryTags || []).some(tag =>
          dietarySet.has(tag.toLowerCase())
        );
  
      return !hasAllergens && matchesDietary;
    });
  }

  private calculateMacroScore(recipe: IRecipe): number {
    if (!recipe?.nutritionalInfo) return 0;
    
    const { protein = 0, carbs = 0, fats = 0 } = recipe.nutritionalInfo;
    const userReq = this.user.nutritionalRequirements;
    const goal  = this.user.goal;
  
    // Weight adjustments based on goal
    let proteinWeight = 0.4;
    let carbWeight = 0.3;
    let fatWeight = 0.3;
  
    if (goal === 'muscle_gain') {
      proteinWeight = 0.6;
      carbWeight = 0.25;
      fatWeight = 0.15;
    } else if (goal === 'weight_loss') {
      proteinWeight = 0.5;
      carbWeight = 0.2;
      fatWeight = 0.3;
    } else if (goal === 'maintenance') {
      proteinWeight = 0.4;
      carbWeight = 0.3;
      fatWeight = 0.3;
    }
  
    return (
      (protein / (userReq.protein || 1)) * proteinWeight +
      (carbs / (userReq.carbs || 1)) * carbWeight +
      (fats / (userReq.fats || 1)) * fatWeight
    ) * 100;
  }

  private calculateGoalScore(recipe: IRecipe): number {
    if (!recipe?.nutritionalInfo) return 0;

    const goal  = this.user.goal;
    const { dailyCalories } = this.user.nutritionalRequirements;
    const { calories = 0, protein = 0 } = recipe.nutritionalInfo;

    switch (goal) {
      case "weight_loss":
        return 100 - Math.abs(calories - dailyCalories * 0.8);
      case "muscle_gain":
        return ((protein || 0) / (dailyCalories || 1)) * 200;
      case "maintenance":
        return 100 - Math.abs(calories - dailyCalories);
      default:
        return 0;
    }
  }

  public async getRecommendations(mealType?: string): Promise<IRecipe[]> {
    try {
      const filtered = this.filterRecipes();
      MemoryManager.getInstance().trackAllocation("filtered_recipes", filtered);

      const processed = await this.processInBatches(
        filtered.filter((recipe) => !mealType || recipe.mealType === mealType)
      );

      return processed;
    } finally {
      MemoryManager.getInstance().releaseMemory("filtered_recipes");
    }
  }

  public static async generateWeeklyPlan(userId: string): Promise< any > {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
  
    // Get ALL valid recipes with ObjectIds
    const allRecipes = await Recipe.find({
      'nutritionalInfo.calories': { $exists: true },
      'nutritionalInfo.protein': { $exists: true }
    });
  
    const engine = new RecommenderEngine(user, allRecipes);
  
    // Get recommendations for each meal type
    const [breakfastRecipes, lunchRecipes, dinnerRecipes] = await Promise.all(
      ['breakfast', 'lunch', 'dinner'].map(async (mealType) => {
        try {
          let recipes = await engine.getRecommendations(mealType);
          // Fallback 1: If no recipes, use any meal type
          if (recipes.length < 7) recipes = await engine.getRecommendations();
          // Fallback 2: If still empty, use random recipes
          if (recipes.length < 7) {
            recipes = await Recipe.aggregate([{ $sample: { size: 7 } }]);
          }
          return recipes.slice(0, 7);
        } catch (error) {
          // Final fallback: Hardcoded backup recipes
          return await Recipe.find().limit(7);
        }
      })
    );
  
    // Validate recipes before creating the plan
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dailyPlans = days.map((day, idx) => {
      const breakfast = breakfastRecipes[idx];
      const lunch = lunchRecipes[idx];
      const dinner = dinnerRecipes[idx];
  
      // Throw error if any meal is missing
      if (!breakfast?._id || !lunch?._id || !dinner?._id) {
        throw new Error(`Missing recipes for ${day}`);
      }
  
      return {
        day,
        mealIds: [breakfast._id, lunch._id, dinner._id], 
        totalCalories: breakfast.nutritionalInfo.calories +
                      lunch.nutritionalInfo.calories +
                      dinner.nutritionalInfo.calories
      };
    });

    const lastPlan = await WeeklyPlan.find({ user: userId }).sort({ weekNumber: -1 }).limit(1);
    let weekNumber = 1;
    if (lastPlan && lastPlan.length > 0) {
      weekNumber = lastPlan[0].weekNumber + 1;
    }
  
    // Create and save the plan
    const plan = await WeeklyPlan.create({
      user: userId,
      weekNumber,
      dailyPlans,
      totalCalories: dailyPlans.reduce((sum, day) => sum + day.totalCalories, 0)
    });
  
    // user.weeklyPlans.push(plan._id as ObjectId);
    await user.save();
  
    // return { weekNumber: plan.weekNumber };
    return {
      user,
      weekStart: new Date(),
      weekNumber: plan.weekNumber,
      dailyPlans,
      totalCalories: dailyPlans.reduce((sum, day) => sum + day.totalCalories, 0),
    };
  }
  
}
