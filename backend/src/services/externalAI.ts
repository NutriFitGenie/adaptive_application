// services/externalAI.ts
import OpenAI from 'openai';
import { IUser } from '../models/UserModel';

export class NutritionAI {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async analyzeProgressReport(user: IUser): Promise<string> {
    const prompt = `Generate a nutrition analysis report for a user with:
      Goal: ${user.goal}
      Progress: ${user.progress.slice(-2).map(p => p.weight)}
      Recommendations: ...`;
  
    const completion = await this.openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 500
    });
  
    return completion.choices[0].text;
  }
}