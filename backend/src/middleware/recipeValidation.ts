import { Request, Response, NextFunction } from 'express';
import Recipe from '../models/recipe';

export const validateRecipes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requiredFields = ['nutritionalInfo.calories', 'nutritionalInfo.protein'];
    const invalidRecipes = await Recipe.find({
      $or: [
        { _id: { $exists: false } },
        ...requiredFields.map(field => ({ [field]: { $exists: false }}))
      ]
    });

    if (invalidRecipes.length > 0) {
      console.error('Invalid recipes found:', invalidRecipes.length);
      return res.status(500).json({
        error: 'Database contains invalid recipes',
        count: invalidRecipes.length
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};