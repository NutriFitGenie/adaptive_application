import { Router } from 'express';
const workoutRouter = Router();
import {
  getWorkoutListController,
  updateWorkoutController,
  deleteWorkoutController,
  generateTestingPlanController,
  updateTestingPlanController,
  getTestingWeekStatusController
} from '../controllers/workoutController';

// Get the workout list for a user
workoutRouter.get('/getWorkout', getWorkoutListController);

// Update a specific workout for a user
workoutRouter.put('/updateWorkout/:id', updateWorkoutController);

// Delete a specific workout for a user
workoutRouter.delete('/deleteWorkout/:id', deleteWorkoutController);

// Get the testing workout list for a user
workoutRouter.get('/generateTestingPlan', generateTestingPlanController);

// Set the testing workout list for a user
workoutRouter.post('/updateTestingPlan', updateTestingPlanController);

workoutRouter.get('/testStatus',getTestingWeekStatusController);

export default workoutRouter;
