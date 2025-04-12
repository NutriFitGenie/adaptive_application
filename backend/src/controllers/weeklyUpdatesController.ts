import { Request, Response } from 'express';
import WeeklyPlan from '../models/WeeklyPlan';
import WeeklyProgress from '../models/WeeklyProgress';


// Create a new weekly plan for a user
export const createWeeklyPlan = async (req: Request, res: Response):Promise<any> => {
  try {
    const { user, plan } = req.body;
    if (!user || !plan) {
      return res.status(400).json({ message: 'User ID and plan details are required.' });
    }
    const newPlan = await WeeklyPlan.create({ user, plan });
    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error creating weekly plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get weekly plans for a user
export const getWeeklyPlansByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const plans = await WeeklyPlan.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching weekly plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Submit a new weekly progress update for a user
export const submitWeeklyProgress = async (req: Request, res: Response):Promise<any> => {
  try {
    const { user, weight, bodyFat, muscleMass, otherMeasurements } = req.body;
    if (!user || !weight) {
      return res.status(400).json({ message: 'User ID and weight are required.' });
    }
    const newProgress = await WeeklyProgress.create({ user, weight, bodyFat, muscleMass, otherMeasurements });
    res.status(201).json(newProgress);
  } catch (error) {
    console.error('Error submitting weekly progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all weekly progress updates for a user
export const getWeeklyProgressByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const progressUpdates = await WeeklyProgress.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(progressUpdates);
  } catch (error) {
    console.error('Error fetching weekly progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};