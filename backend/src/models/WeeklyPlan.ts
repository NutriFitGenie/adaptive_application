// WeeklyPlan.ts (Final Schema)
import { Schema, model, Document } from 'mongoose';

export interface IDailyPlan {
  day: string;
  mealIds: Schema.Types.ObjectId[]; // Array of Recipe IDs
  totalCalories: number;
}

export interface IWeeklyPlan extends Document {
  user: Schema.Types.ObjectId;
  weekNumber: number;
  dailyPlans: IDailyPlan[];
  totalCalories: number;
  completed: boolean;
}

const WeeklyPlanSchema = new Schema<IWeeklyPlan>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  weekNumber: { type: Number, required: true },
  dailyPlans: [{
    day: { type: String, required: true },
    mealIds: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Recipe', 
      required: true 
    }],
    totalCalories: { type: Number, required: true }
  }],
  totalCalories: { type: Number, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

WeeklyPlanSchema.virtual('dailyMeals', {
  ref: 'Recipe',
  localField: 'dailyPlans.mealIds', // ✅ Correct path
  foreignField: '_id',
  justOne: false
});

WeeklyPlanSchema.set('toObject', { virtuals: true });
WeeklyPlanSchema.set('toJSON', { virtuals: true });
export default model<IWeeklyPlan>('WeeklyPlan', WeeklyPlanSchema);