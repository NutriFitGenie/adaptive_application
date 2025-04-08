import { Request, Response, RequestHandler } from 'express';
import { ChatGPTService } from '../services/chatgpt.service';

export class ChatGPTController {
    private chatGPTService: ChatGPTService;

    constructor() {
        this.chatGPTService = new ChatGPTService();
    }

    generateResponse: RequestHandler = async (req, res, next) => {
        try {
            const { prompt } = req.body;
            
            if (!prompt) {
                res.status(400).json({ error: 'Prompt is required' });
                return;
            }

            const response = await this.chatGPTService.generateResponse(prompt);
            res.json({ response });
        } catch (error) {
            console.error('Error in ChatGPT controller:', error);
            res.status(500).json({ error: 'Failed to generate response' });
        }
    }

    generateResponseWithContext: RequestHandler = async (req, res, next) => {
        try {
            const { prompt, context } = req.body;
            
            if (!prompt || !context) {
                res.status(400).json({ error: 'Prompt and context are required' });
                return;
            }

            const response = await this.chatGPTService.generateResponseWithContext(prompt, context);
            res.json({ response });
        } catch (error) {
            console.error('Error in ChatGPT controller:', error);
            res.status(500).json({ error: 'Failed to generate response' });
        }
    }
} 