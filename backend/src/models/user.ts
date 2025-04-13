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
  dietaryPreferences?: string[];
  healthConditions?: string[];
  testingWeekStatus?: boolean;
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model<IUser>('User', UserSchema);