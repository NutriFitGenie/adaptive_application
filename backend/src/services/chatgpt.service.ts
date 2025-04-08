import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class ChatGPTService {
    async generateResponse(prompt: string): Promise<string> {
        try {
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-3.5-turbo",
            });

            return completion.choices[0]?.message?.content || 'No response generated';
        } catch (error) {
            console.error('Error in ChatGPT service:', error);
            throw new Error('Failed to generate response from ChatGPT');
        }
    }

    async generateResponseWithContext(prompt: string, context: string): Promise<string> {
        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: context },
                    { role: "user", content: prompt }
                ],
                model: "gpt-3.5-turbo",
            });

            return completion.choices[0]?.message?.content || 'No response generated';
        } catch (error) {
            console.error('Error in ChatGPT service:', error);
            throw new Error('Failed to generate response from ChatGPT');
        }
    }
} 