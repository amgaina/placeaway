import OpenAI from 'openai';
import {
  AIMessage,
  AITripSuggestion,
  TripPreferenceInput,
} from '@/schemas/trip';

export class AIService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  static async generateTripSuggestion(
    preferences: TripPreferenceInput['preferences'],
  ): Promise<AITripSuggestion> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a travel planning assistant.',
        },
        {
          role: 'user',
          content: `Generate a trip suggestion for: ${JSON.stringify(preferences)}`,
        },
      ],
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
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
