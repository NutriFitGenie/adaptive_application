// src/services/userService.ts
import User, { IUser } from '../models/user';

/**
 * Create a new user in the database.
 * @param data - An object containing username, email, and password.
 * @returns The newly created user.
 */
export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  const user = new User(data);
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
 * Retrieve all users from the database.
 * @returns An array of user documents.
 */
export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};

/**
 * Update a user by their ID.
 * @param id - The user’s unique identifier.
 * @param data - An object containing fields to update.
 * @returns The updated user document or null if not found.
 */
export const updateUser = async (
  id: string,
  data: Partial<{ username: string; email: string; password: string }>
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