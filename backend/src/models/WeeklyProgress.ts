// src/models/WeeklyProgress.ts
import { Schema, model, Document } from 'mongoose';

export interface IWeeklyProgress extends Document {
  user: Schema.Types.ObjectId;
  weekNumber: number;
  date: Date;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
}

const WeeklyProgressSchema: Schema = new Schema<IWeeklyProgress>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    weekNumber: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    weight: { type: Number, required: true },
    bodyFat: { type: Number },
    muscleMass: { type: Number },
  },
  {
    timestamps: true,
  }
);

export default model<IWeeklyProgress>('WeeklyProgress', WeeklyProgressSchema);