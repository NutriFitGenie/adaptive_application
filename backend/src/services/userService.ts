// src/services/userService.ts
import User, { IUser } from '../models/UserModel';

/**
 * Create a new user in the database.
 * @param data - An object containing username, email, password, and additional fields such as height, weight, dietary preferences, allergies, and fitness goal.
 * @returns The newly created user.
 */
export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  dietaryPreferences: string;
  allergies: string;
  fitnessGoal: string;
}): Promise<IUser> => {
  const mappedData = {
    name: data.username,
    email: data.email,
    password: data.password,
    personalInfo: {
      age: data.age,
      gender: data.gender,
      height: data.height,
      activityLevel: data.activityLevel
    },
    preferences: {
      dietary: data.dietaryPreferences.split(',').map(s => s.trim()),
      allergies: data.allergies.split(',').map(s => s.trim()),
      excludedIngredients: []
    },
    fitnessGoals: {
      goal: data.fitnessGoal as "weight_loss" | "muscle_gain" | "maintenance",
      targetWeight: data.weight,
      weeklyCommitment: 3
    },
    nutritionalRequirements: {
      bmr: 0,
      tdee: 0,
      dailyCalories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    },
    progress: [],
    preferredRecipes: []
  };

  return await new User(mappedData).save();
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