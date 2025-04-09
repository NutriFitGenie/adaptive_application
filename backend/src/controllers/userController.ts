import { Request, Response } from 'express';
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
} from '../services/userService';
import User from './../models/UserModel'; // Import the User model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/env.config';

export const createUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract additional fields from the request body
    const {
      username,
      email,
      password,
      height,             // in centimeters
      weight,             // in kilograms (will be used as targetWeight)
      dietaryPreferences, // e.g., comma-separated string e.g., "vegan, paleo" or an array
      allergies,          // e.g., comma-separated string e.g., "peanuts, milk" or an array
      fitnessGoal         // should be one of 'weight_loss', 'muscle_gain', 'maintenance'
    } = req.body;
    
    // Hash the password
    const hashedPassword: string = await bcrypt.hash(password, 10);
    console.log(req.body, "req.body");

    // Map the flat incoming data into the nested structure your model expects.
    // Check if dietaryPreferences and allergies are arrays already.
    const userData = {
      name: username, // mapping 'username' to 'name'
      email,
      password: hashedPassword,
      preferences: {
        dietary: Array.isArray(dietaryPreferences)
          ? dietaryPreferences
          : dietaryPreferences
            ? dietaryPreferences.split(",").map((s: string) => s.trim())
            : [],
        allergies: Array.isArray(allergies)
          ? allergies
          : allergies
            ? allergies.split(",").map((s: string) => s.trim())
            : [],
        excludedIngredients: [] // default empty array
      },
      fitnessGoals: {
        goal: (fitnessGoal as "weight_loss" | "muscle_gain" | "maintenance") || "weight_loss",
        targetWeight: weight ? Number(weight) : 0,
        weeklyCommitment: 3 // default weekly commitment; update as needed
      },
      progress: [],
      nutritionalRequirements: {
        dailyCalories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      },
      preferredRecipes: [] as any,
      // Optionally, store height if your model supports it.
      height: height ? Number(height) : undefined
    };

    // Create a new User instance and save it directly to the database
    const newUser = await new User(userData).save();
    console.log(newUser, "newUser");

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error storing user:", error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const loginUserController = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const getUser = await getUserByEmail(email);
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
        fitnessGoal: getUser.fitnessGoals,
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