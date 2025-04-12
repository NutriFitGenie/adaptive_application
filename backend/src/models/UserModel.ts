import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
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
  weeklyPlans: Schema.Types.ObjectId[];
  preferredRecipes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  personalInfo: {
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    height: { type: Number, required: true },
    activityLevel: { 
      type: String, 
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      required: true
    }
  },
  preferences: {
    dietary: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    excludedIngredients: { type: [String], default: [] },
    cuisinePreferences: { type: [String], default: [] }
  },
  fitnessGoals: {
    goal: { type: String, enum: ['weight_loss', 'muscle_gain', 'maintenance'], required: true },
    targetWeight: { type: Number, required: true },
    timeframeWeeks: { type: Number, min: 1, max: 52, default: 12 }
  },
  nutritionalRequirements: {
    bmr: { type: Number, required: true },
    tdee: { type: Number, required: true },
    dailyCalories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true }
  },
  progress: [{
    week: { type: Number, required: true },
    weight: { type: Number, required: true },
    bodyFat: Number,
    measurements: {
      waist: Number,
      hips: Number,
      chest: Number
    }
  }],
  weeklyPlans: [{ type: Schema.Types.ObjectId, ref: 'WeeklyPlan' }],
  preferredRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
}, { timestamps: true });
  
  UserSchema.virtual('weeklyPlan', {
    ref: 'WeeklyPlan',
    localField: 'weeklyPlans',
    foreignField: '_id',
    justOne: true
  });
  
  UserSchema.set('toObject', { virtuals: true });
  UserSchema.set('toJSON', { virtuals: true });
  

export default model<IUser>('User', UserSchema);