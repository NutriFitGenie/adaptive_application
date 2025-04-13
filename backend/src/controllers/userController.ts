import { Request, Response } from 'express';
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
} from '../services/userService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/env.config';

export const createUserController = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      age,
      gender,
      email,
      password,
      goal,
      fitnessLevel,
      daysPerWeek,
      targetWeight,
      weight,
      height,
      neck,
      waist,
      activityLevel,
      units,
      dietaryPreferences,
      healthConditions,
    } = req.body;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      firstName,
      lastName,
      age,
      gender,
      email,
      password: hashedPassword,
      goal,
      fitnessLevel,
      daysPerWeek,
      targetWeight,
      weight,
      height,
      neck,
      waist,
      activityLevel,
      units,
      dietaryPreferences,
      healthConditions,
    });

    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      config.JWT_SECRET as jwt.Secret,
      { expiresIn: config.JWT_TOKEN_EXPIRE as string }
    );

    const userResponse = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      goal: newUser.goal,
      fitnessLevel: newUser.fitnessLevel,
      // ... add more if needed
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse,
    });

  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const getUser = await getUserByEmail(email);
    // All data if you want send during logging to store in local storage add here 
    const userData = {
      id : getUser?.id,
      username : getUser?.username,
      email : getUser?.email,
    }
    if (!getUser) {
      return res.status(400).json({ message: 'User not found.' });
    }
    const isMatch = await bcrypt.compare(password, getUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // Generate a JWT token (adjust secret and expiration as needed)
    // Ensure the secret is defined correctly
  if (!config.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const token = jwt.sign(
  { email: getUser.email },
  config.JWT_SECRET as jwt.Secret,  // Correct type for secret key
  { expiresIn: config.JWT_TOKEN_EXPIRE as string } // Ensuring it matches expected type
);

    res.status(201).json({ message: 'Login successful.', token:token, userData:userData });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

export const getUserController = async (req: Request, res: Response) => {
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

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const {username, email, password} = req.body;
    const hashedPassword : string = await bcrypt.hash(password, 10);
    const updatedUser = await updateUser(req.params.id, {username,email,password:hashedPassword});
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const deletedUser = await deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};