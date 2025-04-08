import { Schema, Document, model } from 'mongoose';

export interface IWorkout extends Document {
  name: string;
  description?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  caloriesBurn: 'low'| 'medium'| 'high'
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
  }
});

const Workout = model<IWorkout>('Workout', WorkoutSchema);
export default Workout;
