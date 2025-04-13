import { Request, Response } from 'express';
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
} from '../services/userService';
import User from '../models/user'; // Import the User model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/env.config';
import {RecommenderEngine } from '../services/FoodRecommender/engine';
import { ProgressAnalyzer } from '../services/FoodRecommender/progress';


export const createUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      goal,
      daysPerWeek,
      neck,
      waist,
      units,
      healthConditions,
      height,
      targetWeight,
      weight,
      activityLevel,
      dietaryPreferences,
      allergies,
      fitnessLevel
    } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      firstName,              
      lastName,                     
      age,
      gender,
      email,
      password: hashedPassword,
      goal,
      neck,
      waist,
      units,
      healthConditions,
      fitnessLevel,                
      activityLevel,
      daysPerWeek,
      weight,
      height,
      dietaryPreferences: typeof dietaryPreferences === 'string'
          ? (dietaryPreferences.trim() !== "" 
                ? dietaryPreferences.split(',').map((s: string) => s.trim())
                : [])
          : (Array.isArray(dietaryPreferences) ? dietaryPreferences : []),
      allergies: typeof allergies === 'string'
          ? (allergies.trim() !== ""
                ? allergies.split(',').map((s: string) => s.trim())
                : [])
          : (Array.isArray(allergies) ? allergies : []),
          // dietaryPreferences: dietaryPreferences.split(',').map((s: string) => s.trim()),
          // allergies: allergies.split(',').map((s: String) => s.trim()),
      targetWeight: Number(targetWeight) || 85,
      testingWeekStatus: true,
       nutritionalRequirements: {
         bmr: 0,
        tdee: 0,
         dailyCalories: 0,
        protein: 0,
         carbs: 0,
         fats: 0
       },
       progress: [],
    };

    const newUser = await new User(userData).save();
    ProgressAnalyzer.initializeNutrition(newUser);
    await newUser.save();
    console.log('User created:', newUser);

    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      config.JWT_SECRET as jwt.Secret,
      { expiresIn: config.JWT_TOKEN_EXPIRE as string }
    );
    setImmediate(async () => {
      try {
         await RecommenderEngine.generateWeeklyPlan((newUser._id as String).toString());

      } catch (err) {
        console.error('Background plan generation failed:', err);
      }
    });
    
    res.status(201).json({message: 'User registered successfully', token, user: newUser});
  } catch (error) {
    console.error("Error storing user:", error);
    res.status(500).json({ error: 'Error creating user' });
  }
};


export const loginUserController = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const getUser = await getUserByEmail(email);
    // All data if you want send during logging to store in local storage add here 
    const userData = {
      id : getUser?.id,
      email : getUser?.email,
    }
    if (!getUser) {
      return res.status(400).json({ message: 'User not found.' });
    }
    
    const isMatch = await bcrypt.compare(password, getUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // Ensure the secret is defined correctly
    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Generate a JWT token. Add extra user info to the token payload, such as id and fitnessGoal.
    const token = jwt.sign(
      {
        id: getUser._id,
        email: getUser.email,
      },
      config.JWT_SECRET as jwt.Secret,
      {
        expiresIn:
          typeof config.JWT_TOKEN_EXPIRE === 'string'
            ? parseInt(config.JWT_TOKEN_EXPIRE, 10)
            : config.JWT_TOKEN_EXPIRE,
      }
    );

    res.status(200).json({ message: 'Login successful.', token, user: getUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

export const getUserController = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user' });
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' });
  }
};

export const updateUserController = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      username,
      email,
      password,
      height,
      weight,
      dietaryPreferences,
      allergies,
      fitnessGoal
    } = req.body;
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const updatedUser = await updateUser(req.params.id, {
      username,
      email,
      password: hashedPassword,
      height,
      weight,
      dietaryPreferences,
      allergies,
      fitnessGoal
    });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

export const deleteUserController = async (req: Request, res: Response): Promise<any> => {
  try {
    const deletedUser = await deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

