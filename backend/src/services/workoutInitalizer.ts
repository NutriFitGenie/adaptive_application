import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Workout from '../models/seedWorkouts';
import config from '../config/env.config';

// Load environment variables from the .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const csvExercises = [ 
  { workoutName: "Landmine Twist", description: "The landmine twist is a rotational abdominal movement performed using an angled barbell anchored in a corner", bodyPart: "Abdominals", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Barbell Squat", description: "A compound exercise where a barbell is placed on the upper back to perform a deep squat targeting the lower body", bodyPart: "Legs", difficulty: "Intermediate", caloriesBurn: "high" },
  { workoutName: "Bench Press", description: "A classic chest exercise performed by pressing a weighted barbell upward from a supine position", bodyPart: "Chest", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Deadlift", description: "An essential full-body lift involving a barbell focusing on the posterior chain including the back and legs", bodyPart: "Back/Legs", difficulty: "Advanced", caloriesBurn: "high" },
  { workoutName: "Overhead Press", description: "A vertical press with a barbell from shoulder height to overhead that targets the shoulders and triceps", bodyPart: "Shoulders", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Dumbbell Row", description: "A unilateral movement using dumbbells to target the upper back and lats", bodyPart: "Back", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Weighted Pull-Up", description: "An advanced pull-up variation where additional weight is added to increase resistance", bodyPart: "Back/Arms", difficulty: "Advanced", caloriesBurn: "high" },
  { workoutName: "Dumbbell Lunges", description: "Stepping lunges performed with dumbbells to enhance balance and leg strength", bodyPart: "Legs", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Cable Fly", description: "A chest isolation exercise using cable machines to emphasize pectoral contraction", bodyPart: "Chest", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Incline Dumbbell Press", description: "A chest exercise performed on an inclined bench to target the upper pecs", bodyPart: "Chest", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Barbell Curl", description: "A biceps isolation movement using a barbell to build arm strength", bodyPart: "Arms", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Weighted Dips", description: "An advanced dip variation with additional weight to intensify the triceps and chest workout", bodyPart: "Arms/Chest", difficulty: "Advanced", caloriesBurn: "high" },
  { workoutName: "Dumbbell Shoulder Press", description: "A seated or standing press using dumbbells to focus on shoulder muscle development", bodyPart: "Shoulders", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Romanian Deadlift", description: "A hamstring and glute-focused variation of the deadlift using a barbell", bodyPart: "Legs/Back", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Weighted Step-Up", description: "A functional exercise where a weighted load is added while stepping onto a raised platform", bodyPart: "Legs", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Leg Press", description: "A machine-based exercise that targets the quadriceps, hamstrings and glutes through pressing movement", bodyPart: "Legs", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Seated Cable Row", description: "An exercise that uses a cable machine to work the middle back through a rowing motion", bodyPart: "Back", difficulty: "Beginner", caloriesBurn: "medium" },
  { workoutName: "Lateral Raise", description: "An isolation exercise performed with dumbbells to target the side deltoids", bodyPart: "Shoulders", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Smith Machine Squat", description: "A variation of the squat using the Smith machine for added stability and controlled movement", bodyPart: "Legs", difficulty: "Intermediate", caloriesBurn: "high" },
  { workoutName: "Weighted Crunch", description: "An abdominal exercise that involves performing crunches with added weight on the chest", bodyPart: "Abdominals", difficulty: "Beginner", caloriesBurn: "low" },
  // Additional 10 exercises:
  { workoutName: "Pull-Up", description: "A bodyweight exercise that targets the upper back and arms using a pull-up bar", bodyPart: "Back/Arms", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Chest Fly", description: "An isolation exercise that uses dumbbells or a machine to target the pectoral muscles", bodyPart: "Chest", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Tricep Pushdown", description: "A cable exercise that isolates the triceps through a downward push motion", bodyPart: "Arms", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Leg Extension", description: "A machine exercise targeting the quadriceps by extending the legs", bodyPart: "Legs", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Hamstring Curl", description: "A machine exercise that isolates and strengthens the hamstrings", bodyPart: "Legs", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Plank", description: "A core stabilization exercise that strengthens the abdominal muscles and lower back", bodyPart: "Core", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Russian Twist", description: "A rotational core exercise using bodyweight or a medicine ball to target the obliques", bodyPart: "Core", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Shrug", description: "An exercise targeting the upper trapezius muscles by elevating the shoulders with dumbbells or a barbell", bodyPart: "Shoulders", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Cable Row", description: "A seated cable exercise that targets the middle back, offering a controlled rowing motion", bodyPart: "Back", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Reverse Fly", description: "An isolation exercise that targets the rear deltoids and upper back using dumbbells or cables", bodyPart: "Shoulders", difficulty: "Beginner", caloriesBurn: "low" }
];


export async function seedWorkouts() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing workouts to avoid duplicates
    await Workout.deleteMany({});
    console.log('Existing workouts removed');

    // Map CSV fields to the Workout model fields
    const workoutsToInsert = csvExercises.map((exercise) => ({
      name: exercise.workoutName,
      description: exercise.description,
      category: exercise.bodyPart,
      difficulty: exercise.difficulty.toLowerCase(),
      caloriesBurn: exercise.caloriesBurn.toLowerCase(), // convert to lowercase for consistency
    }));

    await Workout.insertMany(workoutsToInsert);
    console.log('Sample workouts seeded successfully.');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding workouts:', error);
    process.exit(1);
  }
}

