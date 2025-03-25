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
    // Creating hashing to create tokens
    // After this we can implement continous Rgisteration also
    const {username, email, password} = req.body;
    const hashedPassword : string = await bcrypt.hash(password, 10);
    const getUser = await getUserByEmail(email);
    if (getUser) {
      return res.status(409).json({ message: 'User Already Exist.' });
    }
    const newUser = await createUser({username,email,password:hashedPassword});
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};



export const loginUserController = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const getUser = await getUserByEmail(email);
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

    res.status(201).json({ message: 'Login successful.', token });
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