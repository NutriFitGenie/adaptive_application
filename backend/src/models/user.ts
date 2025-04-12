import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  email: string;
  password: string;
  testingWeekStatus:boolean
  fitnessGoal:String;
  workoutDays:number;
  experienceLevel:String;
  weight?: number;
  height?: number;
  neck?: number;
  waist?: number;
  activityLevel?: string;
  units?: "metric" | "imperial";
  dietaryPreferences?: string[];
  healthConditions?: string[];
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    age: { type: Number },
    gender: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fitnessGoal: { type: String, required: false },
    workoutDays: { type: Number, required: false },
    experienceLevel: { type: String, required: false },
    testingWeekStatus: { type: Boolean, required: false ,default: true },
    weight: { type: Number },
    height: { type: Number },
    neck: { type: Number },
    waist: { type: Number },
    activityLevel: { type: String },
    units: { type: String, enum: ['metric', 'imperial'] },
    dietaryPreferences: [{ type: String }],
    healthConditions: [{ type: String }],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model<IUser>('User', UserSchema);