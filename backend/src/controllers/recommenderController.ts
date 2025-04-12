import { Request, Response } from 'express';
import { IUser } from '../models/UserModel';
import User from '../models/UserModel';
import Recipe from '../models/recipe';
import { RecommenderEngine } from '../services/FoodRecommender/engine';
import {ProgressAnalyzer} from '../services/FoodRecommender/progress';


    export const getRecommendations= async (req: Request, res: Response):Promise<any> => {
    try {
      const user = await User.findById(req.params.userId)
        .populate('progress')
        .exec() as IUser;
      
      if (!user) return res.status(404).json({ error: 'User not found' });

      const recipes = await Recipe.find();
      const engine = new RecommenderEngine(user, recipes);
      
      res.json({
        recommendations: engine.getEnhancedRecommendations(),
        nutritionalGoals: user.nutritionalRequirements
      });
    } catch (error) {
      console.error('Recommendation error:', error);
      res.status(500).json({ error: 'Recommendation failed' });
    }
  }
    export const trackProgress= async (req: Request, res: Response):Promise<any> => {
    try {
      const user = await User.findById(req.body.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      user.progress.push(req.body.metrics);
      await user.save();
      
      ProgressAnalyzer.analyzeProgress(user);
      res.json({ status: 'Progress updated' });
    } catch (error) {
      console.error('Progress tracking error:', error);
      res.status(500).json({ error: 'Progress update failed' });
    }
  }

  export const trackRecipeChoice= async (req: Request, res: Response):Promise<any> => {
    try {
      const { userId, recipeId } = req.body;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (!user.preferredRecipes.includes(recipeId)) {
        user.preferredRecipes.push(recipeId);
        await user.save();
      }
      
      res.json({ status: 'Preference tracked' });
    } catch (error) {
      console.error('Recipe tracking error:', error);
      res.status(500).json({ error: 'Tracking failed' });
    }
  }
