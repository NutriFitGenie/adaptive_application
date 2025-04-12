import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  age: number; 
  fitnessGoal:String;
  workoutDays:number;
  experienceLevel:String;
  testingWeekStatus:boolean
  // You can add additional fields here (e.g., roles, profile info, etc.)
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    fitnessGoal: { type: String, required: false },
    workoutDays: { type: Number, required: false },
    experienceLevel: { type: String, required: false },
    testingWeekStatus: { type: Boolean, required: false ,default: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model<IUser>('User', UserSchema);