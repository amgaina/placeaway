import OpenAI from 'openai';
import {
  AIMessage,
  AITripSuggestion,
  TripPreferenceInput,
  AITripSuggestionSchema,
} from '@/schemas/trip';

export class AIService {
  private static openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  static async generateTripSuggestion(
    preferences: TripPreferenceInput['preferences'],
  ): Promise<AITripSuggestion> {
    const completion = await this.openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            'You are a travel planning assistant. Provide detailed trip suggestions in the required format.',
        },
        {
          role: 'user',
          content: `Generate a trip suggestion for: ${JSON.stringify(preferences)}`,
        },
      ],
    });

    const suggestion = JSON.parse(
      completion.choices[0].message.content || '{}',
    );
    return AITripSuggestionSchema.parse(suggestion);
  }

  static async processChatMessage(
    tripId: string,
    messages: AIMessage[],
  ): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a travel planning assistant helping modify trip details.',
        },
        ...messages,
      ],
    });

    return completion.choices[0].message.content || '';
  }
}
