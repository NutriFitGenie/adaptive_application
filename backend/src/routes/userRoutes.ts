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
 *       description: User object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "secretpassword"
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error.
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