
import { Schema, model, Document } from 'mongoose';

export interface IRecipe extends Document {
  _id: number;
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
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';

}

const RecipeSchema = new Schema<IRecipe>({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  cookingTime: Number,
  ingredients: [String],
  preparationSteps: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  dietaryTags: [String],
  allergens: [String],
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },

});

export default model<IRecipe>('Recipe', RecipeSchema);