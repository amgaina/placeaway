'use server';

import { OpenAI } from 'openai';
import {
  AIMessage,
  AITripSuggestionSchema,
  TripPreferenceInput,
} from '@/schemas/trip';

class TripAIService {
  private static openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  private static readonly SYSTEM_PROMPT = `You are an expert travel planning assistant. Generate trip plans in JSON format.

EXAMPLE INPUT:
Destination: Paris
Visitors: 2
Has Children: No
Has Pets: No
Interests: Art, Food, History

EXAMPLE JSON OUTPUT:
{
  "destination": "Paris",
  "activities": [
    "Morning visit to the Louvre Museum (9:00 AM - 12:00 PM)",
    "Afternoon food tour in Montmartre (2:00 PM - 5:00 PM)",
    "Evening Seine River cruise (7:30 PM - 9:00 PM)"
  ],
  "budget": {
    "accommodation": 200,
    "transport": 50,
    "activities": 100,
    "food": 80,
    "other": 30
  },
  "recommendations": [
    "Purchase Paris Museum Pass for better value",
    "Book Eiffel Tower tickets 3 months in advance",
    "Best time for photography: early morning"
  ],
  "itinerary": [
    {
      "day": 1,
      "activities": [
        "Louvre Museum tour",
        "Seine River cruise"
      ],
      "date": "2024-03-20"
    }
  ]
}`;

  static async generateTripSuggestion(
    preferences: TripPreferenceInput['preferences'],
  ) {
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: this.SYSTEM_PROMPT },
            {
              role: 'user',
              content: `Generate a comprehensive trip plan in JSON format for:
Destination: ${preferences.destination || 'to be suggested'}
Visitors: ${preferences.visitorCount}
Has Children: ${preferences.hasChildren ? 'Yes' : 'No'}
Has Pets: ${preferences.hasPets ? 'Yes' : 'No'}
Interests: ${preferences.interests.join(', ')}
${preferences.origin ? `Starting from: ${preferences.origin}` : ''}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 4000,
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('Empty response from AI');

        const suggestion = JSON.parse(content);
        return AITripSuggestionSchema.parse(suggestion);
      } catch (error) {
        retries++;
        if (retries === maxRetries) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
      }
    }
  }

  static async processChatMessage(
    tripId: string,
    messages: AIMessage[],
  ): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            'You are a travel assistant helping modify trip details. Provide clear, actionable responses.',
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0].message.content || '';
  }
}

export default TripAIService;
