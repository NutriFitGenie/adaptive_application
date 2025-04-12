import plannedExercise, { IPlannedExercise } from '../models/planned_workout';
import actualExercise, { IActualExercise } from '../models/actual_workout';
import Workout from '../models/seedWorkouts';
import User from '../models/user';
import { Bandit, ACTIONS, generateWeek2Plan, calculateReward } from './workoutEngine';


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
    weight:number;
    set1Reps:number;
    set2Reps:number;
    set3Reps:number;
    week:number;
  }
  
  interface DayUpdate {
    Day: string;
    Exercises: ExerciseUpdate[];
  }
  
  interface UpdateTestingPlanBulkParams {
    userId: string;
    updatedPlan: DayUpdate[];
  }
  interface HistoryEntry {
    week: number;
    plannedWeight: number;
    actualWeight: number;
    planned: number[];
    actual: number[];
    performanceRatio: string;
    performanceClass: string;
  }
  
  interface ExerciseWithHistory {
    _id: string;
    name: string;
    history?: HistoryEntry[];
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

// Retrieve all workouts for a user
export const getCurrentWorkoutList = async ({ userId }: GetWorkoutListParams): Promise<IActualExercise[]> => {
  // Find the record with the highest week for the user.
  const latestPlan = await plannedExercise.find({ userId }).sort({ week: -1 }).limit(1);
  const latestActualPlan = await actualExercise.find({ userId }).sort({ week: -1 }).limit(1);
  let lastday = 1;
  
  // If no records exist, return an empty array.
  if (!latestPlan.length) {
    return [];
  }
  // Extract the highest week value.
  const highestWeekplan = latestPlan[0].week;
  if (latestActualPlan.length) {
    const count = await actualExercise.countDocuments({ userId, week: highestWeekplan });
    if (count > 0) {
      const actualExercises = await actualExercise
        .find({ userId, week: highestWeekplan })
        .sort({ day: -1 })
        .limit(1);
        
      lastday = actualExercises[0].day + 1;
    }
  }
  // Retrieve all exercises with the highest week value.
  const exercises = await plannedExercise.find({ userId, week: highestWeekplan, day:lastday });
  return exercises;
};
export const getWorkoutHistory = async ({ userId }: GetWorkoutListParams): Promise<ExerciseWithHistory[]> => {
  try {
    const allPlan = await plannedExercise.find({ userId });
    const allActual = await actualExercise.find({ userId });

    // Map exerciseId to name from seedWorkouts
    const allSeed = await Workout.find();
    const nameMap: Record<string, string> = {};
    allSeed.forEach(w => {
      nameMap[w.name.toLowerCase()] = w.name;
    });

    const historyMap: Record<string, ExerciseWithHistory> = {};

    // Helper function to classify performance
    const classifyPerformance = (ratio: number): string => {
      if (ratio >= 1.0) return "Excellent";
      if (ratio >= 0.75) return "Good";
      if (ratio >= 0.5) return "Average";
      return "Poor";
    };

    for (const plan of allPlan) {
      const key = `${plan.name.toLowerCase()}`;
      const plannedReps = [
        plan.set1Reps ?? 0,
        plan.set2Reps ?? 0,
        plan.set3Reps ?? 0,
      ].filter(r => r > 0);

      const matchingActual = allActual.find(
        act => act.name.toLowerCase() === plan.name.toLowerCase() &&
               act.week === plan.week &&
               act.day === plan.day
      );

      // ❗ Skip this entry if actual weight is not present
      if (!matchingActual?.weight) continue;

      const actualReps = [
        matchingActual.set1Reps ?? 0,
        matchingActual.set2Reps ?? 0,
        matchingActual.set3Reps ?? 0,
      ].filter(r => r > 0);

      const totalPlanned = plannedReps.reduce((a, b) => a + b, 0);
      const totalActual = actualReps.reduce((a, b) => a + b, 0);
      const plannedVolume = totalPlanned * (plan.weight ?? 0);
      const actualVolume = totalActual * (matchingActual.weight ?? 0);
      const ratio = plannedVolume > 0 ? actualVolume / plannedVolume : 0;
      const performanceRatio = (ratio * 100).toFixed(1) + '%';
      const performanceClass = classifyPerformance(ratio);

      if (!historyMap[key]) {
        historyMap[key] = {
          _id: key,
          name: nameMap[key] || plan.name,
          history: [],
        };
      }

      historyMap[key].history!.push({
        week: plan.week,
        plannedWeight: plan.weight ?? 0,
        actualWeight: matchingActual.weight,
        planned: plannedReps,
        actual: actualReps,
        performanceRatio,
        performanceClass,
      });
    }

    return Object.values(historyMap);
  } catch (err) {
    console.error("Error in getWorkoutHistory:", err);
    throw new Error("Error fetching workout history");
  }
};

export const updateWorkout = async ({
  userId,
  updatedPlan
}: UpdateTestingPlanBulkParams): Promise<boolean> => {
  try {
    const actualDocuments: Partial<IActualExercise>[] = [];
    let currentWeek = 1, currentDay = 1;

    updatedPlan.forEach(dayPlan => {
      const dayNumber = parseInt(dayPlan.Day, 10);
      dayPlan.Exercises.forEach((exercise) => {
        currentWeek = exercise.week;
        currentDay = dayNumber;
        actualDocuments.push({
          day: dayNumber,
          userId,
          name: exercise.Exercise,
          description: exercise.description,
          category: exercise.body_part,
          weight: exercise.weight,
          set1Reps: exercise.set1Reps,
          set2Reps: exercise.set2Reps,
          set3Reps: exercise.set3Reps,
          week: exercise.week
        });
      });
    });

    const actualResults = await actualExercise.insertMany(actualDocuments);

    const user = await User.findById(userId);
    if (user != null && currentDay >= user.workoutDays) {
      const bandit = new Bandit(0.2, 5);
      await bandit.load(userId); // Load previous model

      const plannedDocuments: Partial<IPlannedExercise>[] = [];

      const plannedWorkouts = await plannedExercise.find({ userId, week: currentWeek });
      const actualWorkouts = await actualExercise.find({ userId, week: currentWeek });

      for (const plannedExercise of plannedWorkouts) {
        const matchingActual = actualWorkouts.find(a => a.name === plannedExercise.name && a.day === plannedExercise.day);

        if (!matchingActual) continue;

        const plannedTotalVolume = ((plannedExercise.set1Reps ?? 0) + (plannedExercise.set2Reps ?? 0) + (plannedExercise.set3Reps ?? 0)) * (plannedExercise.weight ?? 0);
        const actualTotalVolume = ((matchingActual.set1Reps ?? 0) + (matchingActual.set2Reps ?? 0) + (matchingActual.set3Reps ?? 0)) * (matchingActual.weight ?? 0);

        const performance = {
          repRatio: (
            ((matchingActual.set1Reps ?? 0) + (matchingActual.set2Reps ?? 0) + (matchingActual.set3Reps ?? 0)) /
            ((plannedExercise.set1Reps ?? 0) + (plannedExercise.set2Reps ?? 0) + (plannedExercise.set3Reps ?? 0))
          ),
          weightRatio: (matchingActual.weight ?? 0) / (plannedExercise.weight ?? 1),
          setRatio: 1, // For simplicity, assuming full set completion
        };

        const userContext = {
          age: user.age,
          goal: user.fitnessGoal as string
        };
        console.log("User Context:", userContext);
        console.log("Performance Metrics:", performance);
        console.log("reps :", Math.round(((plannedExercise.set1Reps ?? 0) + (plannedExercise.set2Reps ?? 0) + (plannedExercise.set3Reps ?? 0)) / 3));

        const { plan: newPlan, action } = generateWeek2Plan({
          weight: plannedExercise.weight ?? 0,
          reps: Math.round(((plannedExercise.set1Reps ?? 0) + (plannedExercise.set2Reps ?? 0) + (plannedExercise.set3Reps ?? 0)) / 3),
        }, userContext, performance, bandit);
        
        const reward = calculateReward(
          { totalVolume: actualTotalVolume },
          { totalVolume: plannedTotalVolume }
        );
        const context = [
          userContext.age / 100,
          userContext.goal === "muscle_gain" ? 1 : 0,
          performance.repRatio,
          performance.weightRatio,
          performance.setRatio
        ];
        bandit.updateModel(action, context, reward);
        
        plannedDocuments.push({
          day: plannedExercise.day,
          userId,
          oneRepMax: plannedExercise.oneRepMax,
          name: plannedExercise.name,
          description: plannedExercise.description,
          category: plannedExercise.category,
          weight: newPlan.weight,
          set1Reps: newPlan.reps,
          set2Reps: newPlan.reps,
          set3Reps: newPlan.reps,
          week: plannedExercise.week + 1
        });
      }

      await plannedExercise.insertMany(plannedDocuments);
      await bandit.save(userId); // Persist updated model
    }

    return actualResults ? true : false;
  } catch (error) {
    console.error("Error updating workout:", error);
    throw error;
  }
};


// Delete a specific workout for a user
export const deleteWorkout = async ({ id, userId }: DeleteWorkoutParams): Promise<IPlannedExercise | null> => {
  const deletedWorkout = await plannedExercise.findOneAndDelete({ _id: id, userId });
  return deletedWorkout;
};

// Generate a testing plan for the week based on user info and workout data.
export const generateTestingPlan = async ({ userId }: GetWorkoutListParams): Promise<TestingPlan[]> => {
  const csvExercises = await Workout.find();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const { experienceLevel, workoutDays, fitnessGoal } = user;
  console.log("User Info:", user);
  console.log("Experience Level:", experienceLevel); 
  console.log("Workout Days:", workoutDays);
  console.log("Fitness Goal:", fitnessGoal);
  // Filter by experience level
  let filteredExercises: any[] = [];
  if (experienceLevel === "beginner") {
    filteredExercises = csvExercises.filter(ex => ex.difficulty.toLowerCase() === "beginner");
  } else if (experienceLevel === "medium") {
    filteredExercises = csvExercises.filter(ex => {
      const d = ex.difficulty.toLowerCase();
      return d === "intermediate" || d === "beginner";
    });
  } else if (experienceLevel === "pro") {
    filteredExercises = csvExercises;
  }

  // If fat_loss, filter exercises by caloriesBurn
  let exercisesPerDay = fitnessGoal === "fat_loss" ? 3 : 4;
  if (fitnessGoal === "fat_loss") {
    filteredExercises = filteredExercises.filter(ex => {
      const burn = ex.caloriesBurn?.toLowerCase?.();
      return burn === "medium" || burn === "high";
    });
  }

  // Shuffle for randomness
  const shuffleArray = (arr: any[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };
  shuffleArray(filteredExercises);
  console.log("filteredExercises Goal:", filteredExercises);
  // Check if enough unique exercises exist
  const totalRequired = workoutDays * exercisesPerDay;
  if (filteredExercises.length < totalRequired) {
    throw new Error("Not enough unique exercises to generate a complete plan without duplicates.");
  }

  // Build the plan
  const plan: TestingPlan[] = [];
  const usedExerciseNames = new Set<string>();
  let exerciseIndex = 0;

  for (let day = 1; day <= workoutDays; day++) {
    const dayPlan: TestingPlan = {
      Day: `${day}`,
      Exercises: []
    };

    let count = 0;
    while (count < exercisesPerDay && exerciseIndex < filteredExercises.length) {
      const exercise = filteredExercises[exerciseIndex++];
      const nameKey = exercise.name.toLowerCase();

      if (usedExerciseNames.has(nameKey)) continue;

      usedExerciseNames.add(nameKey);
      dayPlan.Exercises.push({
        name: exercise.name,
        description: exercise.description,
        category: exercise.category,
        oneRepMax: ''
      });
      count++;
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