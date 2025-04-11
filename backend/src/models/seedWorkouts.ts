import { Schema, Document, model } from 'mongoose';

export interface IWorkout extends Document {
  name: string;
  description?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  caloriesBurn: 'low'| 'medium'| 'high';
  link: String;
}

const WorkoutSchema: Schema = new Schema({
  name: { type: String, required: true },     
  description: { type: String },
  category: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  caloriesBurn: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  link: { type: String, required: true },
});

const Workout = model<IWorkout>('Workout', WorkoutSchema);
export default Workout;
