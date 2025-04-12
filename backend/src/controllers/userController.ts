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
    // Extract fields from the request body (merging both versions)
    const {
      // From HEAD version
      username,
      dietaryPreferences,
      allergies,
      fitnessGoal,
      
      // From second branch
      firstName,
      lastName,
      age,
      gender,
      email,
      password,
      goal,
      fitnessLevel,
      daysPerWeek,
      weight,
      height,
      neck,
      waist,
      activityLevel,
      units,
      healthConditions
    } = req.body;
    
    // Check if the user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
       res.status(400).json({ error: "Email already in use" });
     return;
    }
    
    // Hash the password
    const hashedPassword: string = await bcrypt.hash(password, 10);
    console.log(req.body, "req.body");

    // Determine the display name: use "username" if provided, otherwise combine firstName and lastName.
    const name = username || `${firstName || ""} ${lastName || ""}`.trim();
    
    // Process dietary preferences and allergies.
    const processField = (field: any) => {
      if (Array.isArray(field)) return field;
      return field ? field.split(",").map((s: string) => s.trim()) : [];
    };

    const preferences = {
      dietary: processField(dietaryPreferences),
      allergies: processField(allergies),
      excludedIngredients: [] // default empty array
    };

    // Choose the fitness goal; if fitnessGoal (from HEAD) is provided, it takes precedence, otherwise use "goal".
    const combinedGoal = fitnessGoal || goal || "weight_loss";

    // Build fitnessGoals object.
    const fitnessGoals = {
      goal: combinedGoal,
      targetWeight: weight ? Number(weight) : 0,
      weeklyCommitment: daysPerWeek ? Number(daysPerWeek) : 3,
      fitnessLevel
    };

    // Assemble the complete user data object.
    const userData = {
      name,
      firstName,
      lastName,
      age,
      gender,
      email,
      password: hashedPassword,
      preferences,
      fitnessGoals,
      neck,
      waist,
      activityLevel,
      units,
      healthConditions,
      progress: [],
      nutritionalRequirements: {
        dailyCalories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      },
      preferredRecipes: [] as any,
      height: height ? Number(height) : undefined,
    };

    // Create a new user using your service function or model.
    const newUser = await createUser(userData);
    console.log(newUser, "newUser");

    // Ensure the JWT_SECRET is defined.
    if (!config.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Generate a JWT token.
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      config.JWT_SECRET as jwt.Secret,
      { expiresIn: config.JWT_TOKEN_EXPIRE as string }
    );

    // Build the response object with selected user fields.
    const userResponse = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      goal: newUser.fitnessGoals.goal,
      fitnessLevel: newUser.fitnessGoals.fitnessLevel,
      // Add additional fields as needed
    };

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error storing user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const loginUserController = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const getUser = await getUserByEmail(email);
    console.log(getUser);
    // All data if you want send during logging to store in local storage add here 
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

    res.status(201).json({ message: 'Login successful.', token:token, userData: JSON.stringify(getUser)});
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