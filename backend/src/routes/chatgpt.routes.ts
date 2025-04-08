import { Router } from 'express';
import { ChatGPTController } from '../controllers/chatgpt.controller';

const router = Router();
const chatGPTController = new ChatGPTController();

/**
 * @swagger
 * /api/chatgpt/generate:
 *   post:
 *     summary: Generate a response using ChatGPT
 *     tags: [ChatGPT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/generate', chatGPTController.generateResponse);

/**
 * @swagger
 * /api/chatgpt/generate-with-context:
 *   post:
 *     summary: Generate a response using ChatGPT with context
 *     tags: [ChatGPT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *               - context
 *             properties:
 *               prompt:
 *                 type: string
 *               context:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/generate-with-context', chatGPTController.generateResponseWithContext);

export default router; 