import { Schema, model, Document } from 'mongoose';
import { IUser } from './UserModel';

export interface IWeeklyProgress extends Document {
  user: IUser['_id'];
  date: Date;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  otherMeasurements?: string;
}

const WeeklyProgressSchema = new Schema<IWeeklyProgress>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: { type: Number, required: true },
  bodyFat: { type: Number },
  muscleMass: { type: Number },
  otherMeasurements: { type: String }
});

export default model<IWeeklyProgress>('WeeklyProgress', WeeklyProgressSchema);