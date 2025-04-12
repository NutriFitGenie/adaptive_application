import { IUser } from '../../models/UserModel';
import { IRecipe } from '../../models/recipe';
import Recipe from '../../models/recipe';

export class RecommenderEngine {

  private user: IUser;
  private allRecipes: IRecipe[];

  constructor(user: IUser, recipes: IRecipe[]) {
    this.user = user;
    this.allRecipes = recipes;
  }

  private filterRecipes(): IRecipe[] {
    return this.allRecipes.filter(recipe => {
      // Enhanced allergen check with partial matches
      const hasAllergens = this.user.preferences.allergies.some(allergen =>
        recipe.ingredients.some((ingredient: string) =>
          ingredient.toLowerCase().includes(allergen.toLowerCase())
        )
      );
      
      // Dietary preference matching with fallback
      const matchesDietary = this.user.preferences.dietary.length > 0 
        ? this.user.preferences.dietary.every(tag => 
            recipe.dietaryTags.includes(tag))
        : true;

      return !hasAllergens && matchesDietary;
    });
  }

  private calculateRecipeScore(recipe: IRecipe): number {
    const { fitnessGoals, nutritionalRequirements } = this.user;
    let score = 0;

    // Base nutritional scoring
    const proteinDiff = Math.abs(recipe.nutritionalInfo.protein - nutritionalRequirements.protein);
    const carbDiff = Math.abs(recipe.nutritionalInfo.carbs - nutritionalRequirements.carbs);
    
   

    // Goal-based scoring
    switch(fitnessGoals.goal) {
      case 'weight_loss':
        score += (1000 - recipe.nutritionalInfo.calories) / 10;
        score -= carbDiff * 2;
        break;
      case 'muscle_gain':
        score += recipe.nutritionalInfo.protein * 3;
        score += (recipe.nutritionalInfo.calories / 15);
        break;
      case 'maintenance':
        score += 120 - Math.abs(recipe.nutritionalInfo.calories - nutritionalRequirements.dailyCalories);
        break;
    }

    return score ;
  }

  public getEnhancedRecommendations(mealType?: string): IRecipe[] {
    try {
      return this.filterRecipes()
        .filter(recipe => !mealType || recipe.mealType === mealType)
        .sort((a, b) => this.calculateTotalScore(b) - this.calculateTotalScore(a))
        .slice(0, 10);
    } catch (error) {
      console.error('Recommendation error:', error);
      return [];
    }
  }

  private calculateTotalScore(recipe: IRecipe): number {
    return this.calculateRecipeScore(recipe) + 
           this.behavioralBoost(recipe) + 
           this.seasonalAdjustment(recipe);
  }

  private behavioralBoost(recipe: IRecipe): number {
    const isPreferred = this.user.preferredRecipes.some(id => 
      id.toString() === (recipe._id ).toString()
    );
    return isPreferred ? 75 : 0;
  }

  private seasonalAdjustment(recipe: IRecipe): number {
    const currentMonth = new Date().getMonth();
    const season = [
      'winter', 'winter', 'spring', 'spring', 'spring', 'summer',
      'summer', 'summer', 'fall', 'fall', 'fall', 'winter'
    ][currentMonth];
    
    const seasonalTagMap: Record<string, string[]> = {
      winter: ['comfort-food', 'soup', 'stew'],
      spring: ['light', 'fresh', 'salad'],
      summer: ['grilled', 'bbq', 'cold'],
      fall: ['harvest', 'baked', 'roasted']
    };

    return recipe.dietaryTags.some(tag => seasonalTagMap[season].includes(tag)) ? 40 : 0;
  }

  private async getSimilarUserPreferences(): Promise<IRecipe[]> {
    // Placeholder for collaborative filtering implementation
    // Use PP_users.csv data for user similarity analysis
    return Recipe.find()
      .sort({ averageRating: -1 })
      .limit(5)
      .exec();
  }
}