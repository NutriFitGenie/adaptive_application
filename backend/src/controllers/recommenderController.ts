import { Request, Response } from 'express';
import { IUser } from '../models/user';
import User from '../models/user';
import Recipe from '../models/recipe';
import {RecommenderEngine } from '../services/FoodRecommender/engine';
import {ProgressAnalyzer} from '../services/FoodRecommender/progress';
import WeeklyPlan from '../models/WeeklyPlan';


export const getRecommendations = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId in URL parameter" });
    }

    // Find the latest weekly plan for this user and populate the full recipe objects
    const plan = await WeeklyPlan.findOne({ user: userId })
      .sort({ weekNumber: -1 })
      .populate('dailyPlans.mealIds') // This populates the recipe details for each mealId
      .exec();

    if (!plan) {
      return res.status(404).json({ error: 'No weekly plan found for this user' });
    }

    res.json({ plan });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

// export const trackProgress= async (req: Request, res: Response):Promise<any> => {
//     try {
//       const user = await User.findById(req.body.userId);
//       if (!user) return res.status(404).json({ error: 'User not found' });

//       user.progress.push(req.body.metrics);
//       await user.save();
      
//       ProgressAnalyzer.analyzeProgress(user);
//       res.json({ status: 'Progress updated' });
//     } catch (error) {
//       console.error('Progress tracking error:', error);
//       res.status(500).json({ error: 'Progress update failed' });
//     }
// }

// export const trackRecipeChoice= async (req: Request, res: Response):Promise<any> => {
//     try {
//       const { userId, recipeId } = req.body;
//       const user = await User.findById(userId);
//       if (!user) return res.status(404).json({ error: 'User not found' });

//       if (!user.preferredRecipes.includes(recipeId)) {
//         user.preferredRecipes.push(recipeId);
//         await user.save();
//       }
      
//       res.json({ status: 'Preference tracked' });
//     } catch (error) {
//       console.error('Recipe tracking error:', error);
//       res.status(500).json({ error: 'Tracking failed' });
//     }
// }
