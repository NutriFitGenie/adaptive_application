import plannedExercise, { IPlannedExercise } from '../models/planned_workout';
import Workout from '../models/seedWorkouts';
import User from '../models/user';

interface GetWorkoutListParams {
  userId: string;
}

interface UpdateWorkoutParams {
  id: string;
  userId: string;
  updateData: Partial<IPlannedExercise>;
}

interface DeleteWorkoutParams {
  id: string;
  userId: string;
}

// Updated TestingPlan interface to represent a daily workout plan.
interface TestingPlan {
  Day: string;
  Exercises: Array<{
    name: string;
    description: string;
    category: string;
    oneRepMax: string; // Placeholder for user input.
  }>;
}


interface ExerciseUpdate {
    Exercise_id: string;
    Exercise: string;
    oneRepMax: number;
    description: string;
    body_part: string;
  }
  
  interface DayUpdate {
    Day: string;
    Exercises: ExerciseUpdate[];
  }
  
  interface UpdateTestingPlanBulkParams {
    userId: string;
    updatedPlan: DayUpdate[];
  }
  

// Retrieve all workouts for a user
export const getWorkoutList = async ({ userId }: GetWorkoutListParams): Promise<IPlannedExercise[]> => {
    // Find the record with the highest week for the user.
    const latestPlan = await plannedExercise.find({ userId }).sort({ week: -1 }).limit(1);
    
    // If no records exist, return an empty array.
    if (!latestPlan.length) {
      return [];
    }
    
    // Extract the highest week value.
    const highestWeek = latestPlan[0].week;
    
    // Retrieve all exercises with the highest week value.
    const exercises = await plannedExercise.find({ userId, week: highestWeek });
    return exercises;
};

// Update a specific workout for a user
export const updateWorkout = async ({ id, userId, updateData }: UpdateWorkoutParams): Promise<IPlannedExercise | null> => {
  const updatedWorkout = await plannedExercise.findOneAndUpdate(
    { _id: id, userId },
    updateData,
    { new: true }
  );
  return updatedWorkout;
};

// Delete a specific workout for a user
export const deleteWorkout = async ({ id, userId }: DeleteWorkoutParams): Promise<IPlannedExercise | null> => {
  const deletedWorkout = await plannedExercise.findOneAndDelete({ _id: id, userId });
  return deletedWorkout;
};

// Generate a testing plan for the week based on user info and workout data.
export const generateTestingPlan = async ({ userId }: GetWorkoutListParams): Promise<TestingPlan[]> => {
  // Fetch workouts from the seed workouts DB - these serve as the strength exercises.
  const csvExercises = await Workout.find();

  // Fetch the user info. Here we assume the User document contains properties:
  // experienceLevel (e.g., "beginner", "medium", "pro"), workoutDays (number), and fitnessGoal (e.g., "fat_loss").
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  console.log("user:"+JSON.stringify(user));
  console.log("csvExercises:"+JSON.stringify(csvExercises));
  // Destructure the necessary user properties.
  const experienceLevel = user.experienceLevel;
  const workoutDays = user.workoutDays;
  const fitnessGoal = user.fitnessGoal;
  // Filter strength exercises based on the user's experience level.
  let selectedExercises: string | any[] = [];
  if (experienceLevel === "beginner") {
    selectedExercises = csvExercises.filter((ex: any) => ex.difficulty.toLowerCase() === "beginner");
  } else if (experienceLevel === "medium") {
    selectedExercises = csvExercises.filter((ex: any) => {
      const d = ex.difficulty.toLowerCase();
      return d === "intermediate" || d === "beginner";
    });
  } else if (experienceLevel === "pro") {
    selectedExercises = csvExercises; // Use all exercises.
  }

  // Build the plan by cycling through the selected exercises.
  const plan: TestingPlan[] = [];
  let exerciseIndex = 0;
  console.log("workoutDays:"+workoutDays);
  for (let day = 1; day <= workoutDays; day++) {
    const dayPlan: TestingPlan = {
      Day: `${day}`,
      Exercises: []
    };

    // Add 3 strength exercises per day.
    for (let i = 0; i < 3; i++) {
      if (exerciseIndex >= selectedExercises.length) {
        exerciseIndex = 0;
      }
      const exercise = selectedExercises[exerciseIndex];
      dayPlan.Exercises.push({
        name: exercise.name,            // Mapped from Workout schema.
        description: exercise.description,
        category: exercise.category,       // Using 'category' as a substitute for body part.
        oneRepMax: ''                       // Placeholder for user input.
      });
      exerciseIndex++;
    }

    plan.push(dayPlan);
  }
  return plan;
};

export const updateTestingPlan = async ({
    userId,
    updatedPlan
  }: UpdateTestingPlanBulkParams): Promise<boolean> => {
    const documentsToInsert: Partial<IPlannedExercise>[] = [];
    // Iterate over each day and its exercises.
    updatedPlan.forEach(day => {
      day.Exercises.forEach(exercise => {
        documentsToInsert.push({ day:parseInt(day.Day),userId:userId,oneRepMax: exercise.oneRepMax,name:exercise.Exercise,description:exercise.description,category:exercise.body_part,weight:Math.round((exercise.oneRepMax * 0.6) / 2.5) * 2.5});
      });
    });
  
    const results = await plannedExercise.insertMany(documentsToInsert);

    if(results)
    {
        await User.findOneAndUpdate(
            { _id:userId },
            {testingWeekStatus: false },
            { new: true }
          );
        return true;
    }
    else{
       return false;
    }
  };

export const getTestingWeekStatus = async ({ userId }: GetWorkoutListParams): Promise<Boolean | undefined> => {
const user = await User.findById(userId);
return user?.testingWeekStatus;
};