import { Request, Response } from 'express';
import WeeklyPlan from '../models/WeeklyPlan';
import WeeklyProgress from '../models/WeeklyProgress';
import { RecommenderEngine } from '../services/FoodRecommender/engine';
import User, { IUser } from '../models/user';



// Create a new weekly plan for a user
// export const createWeeklyPlan = async (req: Request, res: Response):Promise<any> => {
//   try {
//     const { user, plan } = req.body;
//     if (!user || !plan) {
//       return res.status(400).json({ message: 'User ID and plan details are required.' });
//     }
//     const newPlan = await WeeklyPlan.create({ user, plan });
//     res.status(201).json(newPlan);
//   } catch (error) {
//     console.error('Error creating weekly plan:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // Get weekly plans for a user
// export const getWeeklyPlansByUser = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     const plans = await WeeklyPlan.find({ user: userId }).sort({ date: -1 });
//     res.status(200).json(plans);
//   } catch (error) {
//     console.error('Error fetching weekly plans:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // Submit a new weekly progress update for a user
// export const submitWeeklyProgress = async (req: Request, res: Response):Promise<any> => {
//   try {
//     const { user, weight, bodyFat, muscleMass, otherMeasurements } = req.body;
//     if (!user || !weight) {
//       return res.status(400).json({ message: 'User ID and weight are required.' });
//     }
//     const newProgress = await WeeklyProgress.create({ user, weight, bodyFat, muscleMass, otherMeasurements });
//     res.status(201).json(newProgress);
//   } catch (error) {
//     console.error('Error submitting weekly progress:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// Get all weekly progress updates for a user

export const getUpdatedPlan = async (req: Request, res: Response):Promise<any> => {
  try {
    const { userId } = req.params;
    // Extract userId from JWT middleware (if available) or request body.
    
    const { weight, bodyFat, muscleMass } = req.body;

    // Determine current week number based on existing WeeklyProgress documents for the user.
    const progressCount = await WeeklyProgress.countDocuments({ user: userId });
    const weekNumber = progressCount + 1;

    // Create new progress record.
    const progress = await WeeklyProgress.create({
      user: userId,
      weekNumber,
      weight,
      bodyFat,
      muscleMass,
    });

    // Update user's nutritional requirements based on latest progress.
    const user = await User.findById(userId);
    if (user) {
      const newNutritionalReqs = computeNutritionalRequirements(user, Number(weight));
      user.nutritionalRequirements = newNutritionalReqs;
      await user.save();
    }

    // Generate a new weekly plan using the recommender engine.
    const newPlanData = await RecommenderEngine.generateWeeklyPlan(userId);
    // Make sure the weekNumber in the plan matches the current week.
    newPlanData.weekNumber = weekNumber;

    // Create a new WeeklyPlan document instead of replacing existing weeks.
    // const newWeeklyPlan = await WeeklyPlan.create(newPlanData);

    res.status(201).json({ message: "Weekly progress updated", progress, weeklyPlan: newPlanData });
  } catch (error) {
    console.error("Error in weeklyUpdatesController:", error);
    res.status(500).json({ message: "Error submitting progress", error });
  }
};

export const computeNutritionalRequirements = (user: IUser, currentWeight: number)=> {
  // Example: Using a simple multiplier for demonstration.
  // You may want to compute BMR using, say, 10 * weight + 6.25 * height - 5 * age + s, etc.
  // For now, let's assume:
  const dailyCalories = Math.round(currentWeight * 35); 
  const tdee = Math.round(currentWeight * 35); 
  const bmr = Math.round(currentWeight * 35); 
  const protein = Math.round(currentWeight * 1.5); // grams per kg, adjust as needed
  const carbs = Math.round((dailyCalories * 0.5) / 4); // 50% of calories from carbs (4 cal per gram)
  const fats = Math.round((dailyCalories * 0.25) / 9); // 25% of calories from fat (9 cal per gram)
  return { bmr,tdee,dailyCalories, protein, carbs, fats, user };
};