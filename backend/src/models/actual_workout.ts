import { Schema, Document, model } from 'mongoose';

export interface IActualExercise extends Document {
  userId: string;
  name: string;
  description?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  weight?: number;
  set1Reps?: number;
  set2Reps?: number;
  set3Reps?: number;
  oneRepMax: number;
  week: number;
}

const actualExerciseSchema: Schema = new Schema({
  userId: { type: String, required: true, ref: 'User' },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  weight: { type: Number, default: 2.5 },
  set1Reps: { type: Number, default: 8 },
  set2Reps: { type: Number, default: 8 },
  set3Reps: { type: Number, default: 8 },
  oneRepMax: { type: Number, required: false },
  week: { type: Number, required: false ,default: 1}
});

const actualExercise = model<IActualExercise>('actualExercise', actualExerciseSchema);
export default actualExercise;
