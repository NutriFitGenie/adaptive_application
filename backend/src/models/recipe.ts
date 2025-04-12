// models/recipe.ts
import { Schema, model, Document } from 'mongoose';

export interface IRecipe extends Document {
  name: string;
  cookingTime: number;
  ingredients: string[];
  preparationSteps: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  dietaryTags: string[];
  allergens: string[];
  mealType: string;  // optional field (e.g., breakfast, lunch, dinner)
}

const RecipeSchema = new Schema<IRecipe>({
  name: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  ingredients: { type: [String], default: [] },
  preparationSteps: { type: [String], default: [] },
  nutritionalInfo: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true }
  },
  dietaryTags: { type: [String], default: [] },
  allergens: { type: [String], default: [] },
  mealType: { type: String }
});
RecipeSchema.virtual('mealDetails').get(function() {
  return {
    name: this.name,
    calories: this.nutritionalInfo.calories,
    mealType: this.mealType
  };
});
export interface IRecipePopulated extends IRecipe {
  mealDetails: {
    name: string;
    calories: number;
    mealType?: string;
  };
}
RecipeSchema.index({ mealType: 1 });
RecipeSchema.index({ dietaryTags: 1 });
RecipeSchema.index({ ingredients: 'text' }, { weights: { ingredients: 1 } });

export default model<IRecipe>('Recipe', RecipeSchema);