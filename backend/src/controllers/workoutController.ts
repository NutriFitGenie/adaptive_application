import { Request, Response } from 'express';
import { getWorkoutList, updateWorkout, deleteWorkout ,generateTestingPlan,updateTestingPlan,getTestingWeekStatus,getCurrentWorkoutList,getWorkoutHistory} from '../services/workoutService';

// Get Workout List for a User
export const getWorkoutListController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }
    const workoutList = await getWorkoutList({ userId: userId as string });
    res.status(200).json(workoutList);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving workout list' });
  }
};

export const getCurrentWorkoutListController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }
    const workoutList = await getCurrentWorkoutList({ userId: userId as string });
    res.status(200).json(workoutList);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving workout list' });
  }
};

export const getWorkoutHistoryController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }
    const workoutList = await getWorkoutHistory({ userId: userId as string });
    res.status(200).json(workoutList);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving workout list' });
  }
};

// Update a specific Workout for a User
export const updateWorkoutController = async (req: Request, res: Response) => {
  try {
    const { userId ,updatedPlan} = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }
    const workoutList = await updateWorkout({ userId,updatedPlan });
    res.status(200).json(workoutList);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving workout list' });
  }
};


// Delete a specific Workout for a User
export const deleteWorkoutController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const { id } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }
    const deletedWorkout = await deleteWorkout({ id, userId: userId as string });
    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Workout not found for this user' });
    }
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting workout' });
  }
};

export const generateTestingPlanController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }
    const workoutList = await generateTestingPlan({ userId: userId as string });
    res.status(200).json(workoutList);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving workout list' });
  }
};

export const updateTestingPlanController = async (req: Request, res: Response) => {
  try {
    const { userId ,updatedPlan} = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }
    const workoutList = await updateTestingPlan({ userId,updatedPlan });
    res.status(200).json(workoutList);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving workout list' });
  }
};

export const getTestingWeekStatusController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }
    const status = await getTestingWeekStatus({ userId: userId as string });
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user' });
  }
};