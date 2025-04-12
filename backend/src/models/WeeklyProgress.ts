// models/WeeklyProgress.ts
import { Schema, model, Document } from 'mongoose';

export interface IWeeklyProgress extends Document {
  user: Schema.Types.ObjectId;
  date: Date;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
}

const WeeklyProgressSchema = new Schema<IWeeklyProgress>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: { type: Number, required: true },
  bodyFat: Number,
  muscleMass: Number,
});

export default model<IWeeklyProgress>('WeeklyProgress', WeeklyProgressSchema);