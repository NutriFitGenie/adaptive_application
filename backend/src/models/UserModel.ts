import { Schema, model, Document } from 'mongoose';

// Export interface separately
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  preferences: {
    dietary: string[];
    allergies: string[];
    excludedIngredients: string[];
  };
  fitnessGoals: {
    goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
    targetWeight: number;
    weeklyCommitment: number;
  };
  progress: Array<{
    date: Date;
    weight: number;
    bodyFat?: number;
    muscleMass?: number;
  }>;
  nutritionalRequirements: {
    dailyCalories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  preferredRecipes: Schema.Types.ObjectId[];
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    preferences: {
      dietary: { type: [String], default: [] },
      allergies: { type: [String], default: [] },
      excludedIngredients: { type: [String], default: [] }
    },
    fitnessGoals: {
      goal: { type: String, enum: ['weight_loss', 'muscle_gain', 'maintenance'], required: true },
      targetWeight: { type: Number, required: true },
      weeklyCommitment: { type: Number, min: 1, max: 7, default: 3 }
    },
    progress: [{
      date: { type: Date, default: Date.now },
      weight: Number,
      bodyFat: Number,
      muscleMass: Number
    }],
    nutritionalRequirements: {
      dailyCalories: Number,
      protein: Number,
      carbs: Number,
      fats: Number
    },
    preferredRecipes: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Recipe',
      default: [] 
    }]
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

export default model<IUser>('User', UserSchema);