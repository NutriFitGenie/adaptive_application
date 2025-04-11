import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Workout from '../models/seedWorkouts';
import config from '../config/env.config';

// Load environment variables from the .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const addYouTubeLink = (name: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(name + ' exercise')}`;

const csvExercises = [
  { workoutName: "Landmine Twist", description: "Rotational abdominal movement using an angled barbell", bodyPart: "Abdominals", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Barbell Squat", description: "Deep squat with barbell targeting quads, glutes, and hamstrings", bodyPart: "Legs", difficulty: "Intermediate", caloriesBurn: "high" },
  { workoutName: "Bench Press", description: "Chest press with a barbell from a flat bench position", bodyPart: "Chest", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Deadlift", description: "Full-body barbell lift engaging posterior chain", bodyPart: "Back/Legs", difficulty: "Advanced", caloriesBurn: "high" },
  { workoutName: "Overhead Press", description: "Barbell press from shoulders to overhead", bodyPart: "Shoulders", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Dumbbell Row", description: "One-arm dumbbell row focusing on back and lats", bodyPart: "Back", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Weighted Pull-Up", description: "Pull-up with added weight for strength", bodyPart: "Back/Arms", difficulty: "Advanced", caloriesBurn: "high" },
  { workoutName: "Dumbbell Lunges", description: "Walking or stepping lunges with dumbbells", bodyPart: "Legs", difficulty: "Beginner", caloriesBurn: "medium" },
  { workoutName: "Cable Fly", description: "Chest isolation using cable crossover machine", bodyPart: "Chest", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Incline Dumbbell Press", description: "Chest press on an inclined bench targeting upper pecs", bodyPart: "Chest", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Barbell Curl", description: "Barbell exercise for building biceps", bodyPart: "Arms", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Weighted Dips", description: "Chest and triceps dip with extra weight", bodyPart: "Arms/Chest", difficulty: "Advanced", caloriesBurn: "high" },
  { workoutName: "Dumbbell Shoulder Press", description: "Overhead shoulder press with dumbbells", bodyPart: "Shoulders", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Romanian Deadlift", description: "Hamstring-dominant deadlift variation", bodyPart: "Legs/Back", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Weighted Step-Up", description: "Step-ups on a platform with dumbbells", bodyPart: "Legs", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Leg Press", description: "Machine exercise for full leg development", bodyPart: "Legs", difficulty: "Beginner", caloriesBurn: "medium" },
  { workoutName: "Seated Cable Row", description: "Rowing movement using a seated cable machine", bodyPart: "Back", difficulty: "Beginner", caloriesBurn: "medium" },
  { workoutName: "Lateral Raise", description: "Shoulder raise with dumbbells to target delts", bodyPart: "Shoulders", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Smith Machine Squat", description: "Squat using a Smith machine for control", bodyPart: "Legs", difficulty: "Intermediate", caloriesBurn: "high" },
  { workoutName: "Weighted Crunch", description: "Crunch movement with weight on chest", bodyPart: "Abdominals", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Pull-Up", description: "Bodyweight upper back and biceps exercise", bodyPart: "Back/Arms", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Chest Fly", description: "Isolation chest move with dumbbells", bodyPart: "Chest", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Tricep Pushdown", description: "Cable pushdown isolating triceps", bodyPart: "Arms", difficulty: "Beginner", caloriesBurn: "medium" },
  { workoutName: "Leg Extension", description: "Machine exercise focusing on quads", bodyPart: "Legs", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Hamstring Curl", description: "Isolates hamstrings using a machine", bodyPart: "Legs", difficulty: "Beginner", caloriesBurn: "medium" },
  { workoutName: "Russian Twist", description: "Oblique exercise with weight or ball", bodyPart: "Core", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Shrug", description: "Trap-focused movement with barbell or dumbbells", bodyPart: "Shoulders", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Cable Row", description: "Mid-back strength builder using cables", bodyPart: "Back", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Reverse Fly", description: "Targets rear delts using dumbbells or machine", bodyPart: "Shoulders", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Front Squat", description: "Barbell squat held on the front of the shoulders", bodyPart: "Legs", difficulty: "Intermediate", caloriesBurn: "high" },
  { workoutName: "Goblet Squat", description: "Dumbbell squat with front hold position", bodyPart: "Legs", difficulty: "Beginner", caloriesBurn: "medium" },
  { workoutName: "Zercher Squat", description: "Squat variation holding barbell in elbows", bodyPart: "Legs", difficulty: "Advanced", caloriesBurn: "high" },
  { workoutName: "Sumo Deadlift", description: "Wide-stance barbell deadlift", bodyPart: "Legs/Back", difficulty: "Intermediate", caloriesBurn: "high" },
  { workoutName: "Snatch-Grip Deadlift", description: "Deadlift variation with wide grip", bodyPart: "Back", difficulty: "Advanced", caloriesBurn: "high" },
  { workoutName: "Push Press", description: "Shoulder press with leg drive", bodyPart: "Shoulders", difficulty: "Intermediate", caloriesBurn: "high" },
  { workoutName: "Arnold Press", description: "Shoulder press with rotation using dumbbells", bodyPart: "Shoulders", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "EZ-Bar Curl", description: "Biceps curl with an angled EZ-bar", bodyPart: "Arms", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Preacher Curl", description: "Isolated biceps curl on preacher bench", bodyPart: "Arms", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Incline Curl", description: "Biceps curl on inclined bench", bodyPart: "Arms", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Skullcrusher", description: "Lying triceps extension with bar or dumbbells", bodyPart: "Arms", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Overhead Tricep Extension", description: "Triceps isolation with dumbbell overhead", bodyPart: "Arms", difficulty: "Intermediate", caloriesBurn: "low" },
  { workoutName: "Hack Squat", description: "Machine squat focusing on quads", bodyPart: "Legs", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Weighted Sit-Up", description: "Core move with weight held across chest", bodyPart: "Abdominals", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Machine Chest Press", description: "Chest pressing on a resistance machine", bodyPart: "Chest", difficulty: "Beginner", caloriesBurn: "medium" },
  { workoutName: "Machine Shoulder Press", description: "Overhead press on machine", bodyPart: "Shoulders", difficulty: "Beginner", caloriesBurn: "medium" },
  { workoutName: "Weighted Russian Twist", description: "Oblique rotation with plate or dumbbell", bodyPart: "Core", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Incline Cable Fly", description: "Cable chest fly from incline position", bodyPart: "Chest", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Cable Lateral Raise", description: "Deltoid isolation with cables", bodyPart: "Shoulders", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Machine Bicep Curl", description: "Arm curl using resistance machine", bodyPart: "Arms", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Cable Tricep Kickback", description: "Isolation tricep exercise using cable", bodyPart: "Arms", difficulty: "Intermediate", caloriesBurn: "low" },
  { workoutName: "Dumbbell Pullover", description: "Lats and chest isolation using dumbbell", bodyPart: "Back/Chest", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Landmine Press", description: "Angled press using landmine bar setup", bodyPart: "Shoulders/Chest", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Machine Calf Raise", description: "Isolated calf training on machine", bodyPart: "Legs", difficulty: "Beginner", caloriesBurn: "low" },
  { workoutName: "Cable Crunch", description: "Kneeling abdominal crunch using cable stack", bodyPart: "Abdominals", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Weighted Leg Raise", description: "Core isolation with ankle weights", bodyPart: "Abdominals", difficulty: "Intermediate", caloriesBurn: "medium" },
  { workoutName: "Dumbbell Deadlift", description: "Romanian-style deadlift using dumbbells", bodyPart: "Legs/Back", difficulty: "Beginner", caloriesBurn: "medium" },
  {
    "workoutName": "Dumbbell Front Raise",
    "description": "Front deltoid raise using dumbbells",
    "bodyPart": "Shoulders",
    "difficulty": "Beginner",
    "caloriesBurn": "medium"
  },
  {
    "workoutName": "Cable Bicep Curl",
    "description": "Curl using cable machine to isolate biceps",
    "bodyPart": "Arms",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Kettlebell Goblet Squat",
    "description": "Squat holding kettlebell at chest",
    "bodyPart": "Legs",
    "difficulty": "Beginner",
    "caloriesBurn": "medium"
  },
  {
    "workoutName": "Dumbbell Chest Press",
    "description": "Chest press with dumbbells on flat bench",
    "bodyPart": "Chest",
    "difficulty": "Beginner",
    "caloriesBurn": "medium"
  },
  {
    "workoutName": "Resistance Band Row",
    "description": "Back row using resistance band",
    "bodyPart": "Back",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Cable Front Raise",
    "description": "Front shoulder raise using cable machine",
    "bodyPart": "Shoulders",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Machine Tricep Press",
    "description": "Seated tricep press using machine",
    "bodyPart": "Arms",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Dumbbell Dead Bug",
    "description": "Weighted core stability move using dumbbells",
    "bodyPart": "Core",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Weighted Wall Sit",
    "description": "Wall sit with weight plate on thighs",
    "bodyPart": "Legs",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Dumbbell Glute Bridge",
    "description": "Hip thrust using a dumbbell over hips",
    "bodyPart": "Legs/Glutes",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Barbell Legs Row",
    "description": "Row targeting Legs using barbell",
    "bodyPart": "Legs",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Dumbbell Core Crunch",
    "description": "Crunch targeting Core using dumbbell",
    "bodyPart": "Core",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Machine Abdominals Extension",
    "description": "Extension targeting Abdominals using machine",
    "bodyPart": "Abdominals",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Kettlebell Legs Press",
    "description": "Press targeting Legs using kettlebell",
    "bodyPart": "Legs",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Cable Abdominals Pull",
    "description": "Pull targeting Abdominals using cable",
    "bodyPart": "Abdominals",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Resistance Band Abdominals Press",
    "description": "Press targeting Abdominals using resistance band",
    "bodyPart": "Abdominals",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Machine Shoulders Press",
    "description": "Press targeting Shoulders using machine",
    "bodyPart": "Shoulders",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Cable Arms Extension",
    "description": "Extension targeting Arms using cable",
    "bodyPart": "Arms",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Resistance Band Glutes Raise",
    "description": "Raise targeting Glutes using resistance band",
    "bodyPart": "Glutes",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Resistance Band Back Fly",
    "description": "Fly targeting Back using resistance band",
    "bodyPart": "Back",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Dumbbell Shoulders Row",
    "description": "Row targeting Shoulders using dumbbell",
    "bodyPart": "Shoulders",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Dumbbell Chest Crunch",
    "description": "Crunch targeting Chest using dumbbell",
    "bodyPart": "Chest",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Machine Abdominals Row",
    "description": "Row targeting Abdominals using machine",
    "bodyPart": "Abdominals",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Barbell Chest Pull",
    "description": "Pull targeting Chest using barbell",
    "bodyPart": "Chest",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Kettlebell Arms Fly",
    "description": "Fly targeting Arms using kettlebell",
    "bodyPart": "Arms",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Dumbbell Legs Curl",
    "description": "Curl targeting Legs using dumbbell",
    "bodyPart": "Legs",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Resistance Band Shoulders Lift",
    "description": "Lift targeting Shoulders using resistance band",
    "bodyPart": "Shoulders",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Kettlebell Back Pull",
    "description": "Pull targeting Back using kettlebell",
    "bodyPart": "Back",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Resistance Band Shoulders Lift",
    "description": "Lift targeting Shoulders using resistance band",
    "bodyPart": "Shoulders",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Dumbbell Chest Fly",
    "description": "Fly targeting Chest using dumbbell",
    "bodyPart": "Chest",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Kettlebell Shoulders Raise",
    "description": "Raise targeting Shoulders using kettlebell",
    "bodyPart": "Shoulders",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Cable Arms Extension",
    "description": "Extension targeting Arms using cable",
    "bodyPart": "Arms",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Machine Arms Thrust",
    "description": "Thrust targeting Arms using machine",
    "bodyPart": "Arms",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Machine Legs Crunch",
    "description": "Crunch targeting Legs using machine",
    "bodyPart": "Legs",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Machine Abdominals Pull",
    "description": "Pull targeting Abdominals using machine",
    "bodyPart": "Abdominals",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Resistance Band Glutes Thrust",
    "description": "Thrust targeting Glutes using resistance band",
    "bodyPart": "Glutes",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Kettlebell Legs Lift",
    "description": "Lift targeting Legs using kettlebell",
    "bodyPart": "Legs",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Dumbbell Back Extension",
    "description": "Extension targeting Back using dumbbell",
    "bodyPart": "Back",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Barbell Glutes Crunch",
    "description": "Crunch targeting Glutes using barbell",
    "bodyPart": "Glutes",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Machine Back Press",
    "description": "Press targeting Back using machine",
    "bodyPart": "Back",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Dumbbell Glutes Row",
    "description": "Row targeting Glutes using dumbbell",
    "bodyPart": "Glutes",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Machine Glutes Pull",
    "description": "Pull targeting Glutes using machine",
    "bodyPart": "Glutes",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Dumbbell Back Row",
    "description": "Row targeting Back using dumbbell",
    "bodyPart": "Back",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Machine Shoulders Press",
    "description": "Press targeting Shoulders using machine",
    "bodyPart": "Shoulders",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Kettlebell Legs Fly",
    "description": "Fly targeting Legs using kettlebell",
    "bodyPart": "Legs",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Barbell Abdominals Pull",
    "description": "Pull targeting Abdominals using barbell",
    "bodyPart": "Abdominals",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Cable Core Fly",
    "description": "Fly targeting Core using cable",
    "bodyPart": "Core",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Cable Arms Row",
    "description": "Row targeting Arms using cable",
    "bodyPart": "Arms",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Barbell Legs Pull",
    "description": "Pull targeting Legs using barbell",
    "bodyPart": "Legs",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Kettlebell Legs Crunch",
    "description": "Crunch targeting Legs using kettlebell",
    "bodyPart": "Legs",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Resistance Band Glutes Pull",
    "description": "Pull targeting Glutes using resistance band",
    "bodyPart": "Glutes",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Cable Back Row",
    "description": "Row targeting Back using cable",
    "bodyPart": "Back",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Resistance Band Core Row",
    "description": "Row targeting Core using resistance band",
    "bodyPart": "Core",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Cable Abdominals Raise",
    "description": "Raise targeting Abdominals using cable",
    "bodyPart": "Abdominals",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Kettlebell Shoulders Pull",
    "description": "Pull targeting Shoulders using kettlebell",
    "bodyPart": "Shoulders",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Resistance Band Shoulders Press",
    "description": "Press targeting Shoulders using resistance band",
    "bodyPart": "Shoulders",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Resistance Band Abdominals Raise",
    "description": "Raise targeting Abdominals using resistance band",
    "bodyPart": "Abdominals",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Machine Abdominals Thrust",
    "description": "Thrust targeting Abdominals using machine",
    "bodyPart": "Abdominals",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Cable Glutes Thrust",
    "description": "Thrust targeting Glutes using cable",
    "bodyPart": "Glutes",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  },
  {
    "workoutName": "Machine Chest Extension",
    "description": "Extension targeting Chest using machine",
    "bodyPart": "Chest",
    "difficulty": "Beginner",
    "caloriesBurn": "low"
  }
].map(exercise => ({
  ...exercise,
  link: addYouTubeLink(exercise.workoutName)
}));



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
      caloriesBurn: exercise.caloriesBurn.toLowerCase(),
      link: exercise.link
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

