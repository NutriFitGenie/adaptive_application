// src/services/userService.ts
import User, { IUser } from '../models/UserModel';

/**
 * Create a new user in the database.
 * @param data - An object containing username, email, password, and additional fields such as height, weight, dietary preferences, allergies, and fitness goal.
 * @returns The newly created user.
 */
export interface CreateUserInput {
  // From HEAD version
  username?: string;
  dietaryPreferences?: string;
  allergies?: string;
  fitnessGoal?: string;
  // From second branch
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  email: string;
  password: string;
  goal?: string;
  fitnessLevel?: string;
  daysPerWeek?: number;
  weight?: number;
  height?: number;
  neck?: number;
  waist?: number;
  activityLevel?: string;
  units?: string;
  healthConditions?: string;
}

// This function assumes that the password has not yet been hashed.
// (If not, then hashing could be done in a controller before calling createUser.)
export const createUser = async (data: CreateUserInput): Promise<IUser> => {
  // Determine the final username: use `username` if provided,
  // otherwise use the combination of firstName and lastName.
  const finalUsername = data.username || `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();

  // Process dietaryPreferences and allergies: if provided as comma-separated strings,
  // convert them to arrays.
  const processStringField = (field?: string): string[] =>
    field ? field.split(",").map((s) => s.trim()) : [];

  const dietaryArray = processStringField(data.dietaryPreferences);
  const allergiesArray = processStringField(data.allergies);

  // Determine the fitness goal using either fitnessGoal (HEAD) or goal (second branch),
  // with a default of "weight_loss".
  const finalFitnessGoal = data.fitnessGoal || data.goal || "weight_loss";

  // Build the user data object according to the model's requirements.
  const userData = {
    name: finalUsername, // your model expects "name"
    email: data.email,
    password: data.password, // ensure password is hashed before or after this function as appropriate
    preferences: {
      dietary: dietaryArray,
      allergies: allergiesArray,
      excludedIngredients: [] as string[], // default empty array
    },
    fitnessGoals: {
      goal: finalFitnessGoal as "weight_loss" | "muscle_gain" | "maintenance",
      targetWeight: data.weight ? Number(data.weight) : 0,
      weeklyCommitment: data.daysPerWeek ? Number(data.daysPerWeek) : 3,
      fitnessLevel: data.fitnessLevel || null,
    },
    age: data.age,
    gender: data.gender,
    neck: data.neck,
    waist: data.waist,
    activityLevel: data.activityLevel,
    units: data.units,
    healthConditions: data.healthConditions,
    progress: [],
    nutritionalRequirements: {
      dailyCalories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    },
    preferredRecipes: [] as any,
    height: data.height ? Number(data.height) : undefined,
    weight: data.weight ? Number(data.weight) : undefined,
    firstName: data.firstName,
    lastName: data.lastName,
  };

  console.log(userData, "Mapped User Data");

  const user = new User(userData);
  console.log(user, "User instance created");

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