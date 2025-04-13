import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  email: string;
  password: string;
  goal?: string;
  fitnessLevel?: string;
  daysPerWeek?: number;
  targetWeight?: number;
  weight?: number;
  height?: number;
  neck?: number;
  waist?: number;
  activityLevel?: string;
  units?: "metric" | "imperial";
  dietaryPreferences: string[];
  healthConditions?: string[];
  testingWeekStatus?: boolean;
  
  allergies?: string[];
  targetWeight?: number;
  nutritionalRequirements: {
    bmr?: number;
    tdee: number;
    dailyCalories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  // weeklyPlans: Schema.Types.ObjectId[];
  progress?: Array<{
    week: number;
    weight: number;
    bodyFat?: number;
    measurements?: {
      waist: number;
      hips: number;
      chest: number;
    };
  }>;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    age: { type: Number },
    gender: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    goal: { type: String },
    fitnessLevel: { type: String },
    daysPerWeek: { type: Number },
    targetWeight: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    neck: { type: Number },
    waist: { type: Number },
    activityLevel: { type: String },
    units: { type: String, enum: ['metric', 'imperial'] },
    dietaryPreferences: [{ type: String }],
    healthConditions: [{ type: String }],
    testingWeekStatus: {type: Boolean, default: true}, 
    nutritionalRequirements: {
      bmr: { type: Number, required: true },
      tdee: { type: Number, required: true },
      dailyCalories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fats: { type: Number, required: true }
    },
    allergies: { type: [String], default: [] },
    targetWeight: { type: Number, required: true },
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
  
);
UserSchema.virtual('weeklyPlan', {
  ref: 'WeeklyPlan',
  localField: 'weeklyPlans',
  foreignField: '_id',
  justOne: true
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
export default mongoose.model<IUser>('User', UserSchema);