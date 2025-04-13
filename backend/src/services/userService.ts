// src/services/userService.ts
import User, { IUser } from '../models/user';

/**
 * Create a new user in the database.
 * @param data - An object containing username, email, password, and additional fields such as height, weight, dietary preferences, allergies, and fitness goal.
 * @returns The newly created user.
 */
export const createUser = async (userData: Partial<IUser>) => {
  const user = new User(userData);
  return await user.save();
};


/**
 * Retrieve a single user by their ID.
 * @param id - The user’s unique identifier.
 * @returns The user document or null if not found.
 */
export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};


/**
 * Retrieve a single user by their email.
 * @param email - The user’s email.
 * @returns The user document or null if not found.
 */
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

/**
 * Retrieve all users from the database.
 * @returns An array of user documents.
 */
export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};

/**
 * Update a user by their ID.
 * @param id - The user’s unique identifier.
 * @param data - An object containing fields to update, including username, email, password, height, weight, dietaryPreferences, allergies, and fitnessGoal.
 * @returns The updated user document or null if not found.
 */
export const updateUser = async (
  id: string,
  data: Partial<{
    username: string;
    email: string;
    password: string;
    height: number;
    weight: number;
    dietaryPreferences: string;
    allergies: string;
    fitnessGoal: string;
  }>
): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Delete a user by their ID.
 * @param id - The user’s unique identifier.
 * @returns The deleted user document or null if not found.
 */
export const deleteUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};