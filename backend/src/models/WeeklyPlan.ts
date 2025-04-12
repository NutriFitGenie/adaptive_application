import { Schema, model, Document } from 'mongoose';
import { IUser } from './UserModel';

export interface IWeeklyPlan extends Document {
  user: IUser['_id'];
  date: Date;
  plan: any; // For example, an object with recommended recipe IDs and other details
}

const WeeklyPlanSchema = new Schema<IWeeklyPlan>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  plan: { type: Schema.Types.Mixed, required: true } // Mixed type lets you store any object
});

export default model<IWeeklyPlan>('WeeklyPlan', WeeklyPlanSchema);