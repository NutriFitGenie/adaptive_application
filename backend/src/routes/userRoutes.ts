import { Router } from 'express';
import {
  loginUserController,createUserController
} from '../controllers/userController';
import { } from '../middleware/authMiddleware';

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               age:
 *                 type: integer
 *                 example: 30
 *               gender:
 *                 type: string
 *                 example: "male"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "secretpassword"
 *               goal:
 *                 type: string
 *                 example: "weight_loss"
 *               fitnessLevel:
 *                 type: string
 *                 example: "beginner"
 *               daysPerWeek:
 *                 type: integer
 *                 example: 3
 *               weight:
 *                 type: number
 *                 example: 75.5
 *               height:
 *                 type: number
 *                 example: 180
 *               neck:
 *                 type: number
 *                 example: 40
 *               waist:
 *                 type: number
 *                 example: 90
 *               activityLevel:
 *                 type: string
 *                 example: "moderate"
 *               units:
 *                 type: string
 *                 enum: [metric, imperial]
 *                 example: "metric"
 *               dietaryPreferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["vegetarian", "low-carb"]
 *               healthConditions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["diabetes"]
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "609a7e4e1c4a5c23b8d9b245"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     goal:
 *                       type: string
 *                       example: "weight_loss"
 *                     fitnessLevel:
 *                       type: string
 *                       example: "beginner"
 *       400:
 *         description: Email already in use
 *       500:
 *         description: Error creating user
 */
userRouter.post('/register', createUserController);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       description: User credentials for authentication
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "secretpassword"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful. Returns a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful."
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid credentials (user not found or incorrect password).
 *       500:
 *         description: Server error.
 */
userRouter.post('/login', loginUserController);
export default userRouter;