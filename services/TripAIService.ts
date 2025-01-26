import { OpenAI } from 'openai';
import {
  AIMessage,
  AITripSuggestionSchema,
  TripPreferenceInput,
} from '@/schemas/trip';
import { z } from 'zod';
import { Client } from '@googlemaps/google-maps-services-js';

export default class TripAIService {
  private static openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  private static readonly DATE_FORMAT = 'yyyy-MM-dd';
  private static readonly TIME_FORMAT = 'HH:mm:ss';

  private static readonly SYSTEM_PROMPT = `You are an expert travel planning assistant. Generate trip plans in JSON format.

NOTES:
- All dates must be in ISO format (${this.DATE_FORMAT})
- All times must be in 24-hour format (${this.TIME_FORMAT})
- All activities must include complete details
- All costs must be in numbers
- Recommendations must include category and priority

EXAMPLE JSON OUTPUT:
{
  "destination": "Paris",
  "activities": [
    {
      "title": "Louvre Museum Tour",
      "description": "Guided tour of key artworks",
      "startTime": "2024-03-20T09:00:00Z",
      "endTime": "2024-03-20T12:00:00Z",
      "location": "Louvre Museum",
      "cost": 25
    }
  ],
  "budget": {
    "accommodation": 200,
    "transport": 50,
    "activities": 100,
    "food": 80,
    "other": 30
  },
  "recommendations": [
    {
      "title": "Purchase Paris Museum Pass",
      "description": "Save money on multiple museum visits with the Paris Museum Pass",
      "category": "ACTIVITIES",
      "priority": "HIGH"
    },
    {
      "title": "Book Accommodation in Le Marais",
      "description": "Central location with easy access to major attractions",
      "category": "ACCOMMODATION",
      "priority": "MEDIUM"
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "activities": [
        {
          "title": "Louvre Museum Tour",
          "description": "Guided tour of key artworks",
          "startTime": "2024-03-20T09:00:00Z",
          "endTime": "2024-03-20T12:00:00Z",
          "location": "Louvre Museum",
          "cost": 25
        }
      ],
      "date": "2024-03-20"
    }
  ]
}`;

  private static readonly TIMEOUT = 60000; // 1 minute
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  private static geocoder = new Client({});

  public static async getCoordinates(location: string) {
    try {
      const response = await this.geocoder.geocode({
        params: {
          address: location,
          key: process.env.GOOGLE_MAPS_API_KEY!,
        },
      });

      if (response.data.results[0]) {
        return {
          lat: response.data.results[0].geometry.location.lat,
          lng: response.data.results[0].geometry.location.lng,
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  private static parseDateTime(dateTimeStr: string | null): Date | null {
    if (!dateTimeStr) return null;
    try {
      const date = new Date(dateTimeStr);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  private static async transformAIResponse(
    response: any,
  ): Promise<z.infer<typeof AITripSuggestionSchema>> {
    // Transform activities with coordinates
    const activitiesWithCoordinates = await Promise.all(
      response.activities.map(async (activity: any) => {
        const coordinates = activity.location
          ? await this.getCoordinates(activity.location)
          : null;
        return {
          ...activity,
          lat: coordinates?.lat || null,
          lng: coordinates?.lng || null,
          startTime: this.parseDateTime(activity.startTime),
          endTime: this.parseDateTime(activity.endTime),
        };
      }),
    );

    console.log(activitiesWithCoordinates);

    // Transform itinerary activities with coordinates
    const itineraryWithCoordinates = await Promise.all(
      response.itinerary.map(async (day: any) => ({
        ...day,
        date: this.parseDateTime(day.date),
        activities: await Promise.all(
          day.activities.map(async (activity: any) => {
            if (typeof activity === 'string') {
              return {
                title: activity,
                description: '',
                location: '',
                cost: 0,
                startTime: null,
                endTime: null,
                lat: null,
                lng: null,
              };
            }

            const coordinates = activity.location
              ? await this.getCoordinates(activity.location)
              : null;

            return {
              ...activity,
              lat: coordinates?.lat || null,
              lng: coordinates?.lng || null,
              startTime: this.parseDateTime(activity.startTime),
              endTime: this.parseDateTime(activity.endTime),
            };
          }),
        ),
      })),
    );

    return {
      destination: response.destination,
      activities: activitiesWithCoordinates,
      budget: response.budget,
      recommendations: response.recommendations.map((rec: any) => ({
        title: rec.title || '',
        description: rec.description || '',
        category: rec.category || 'GENERAL',
        priority: rec.priority || 'MEDIUM',
      })),
      itinerary: itineraryWithCoordinates,
    };
  }

  static async generateTripSuggestion(
    preferences: TripPreferenceInput['preferences'],
  ) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
    let retries = 0;

    while (retries < this.MAX_RETRIES) {
      try {
        const completion = await this.openai.chat.completions.create(
          {
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
          },
          {
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);
        const content = completion.choices[0].message.content;
        if (!content) throw new Error('Empty response from AI');

        const suggestion = JSON.parse(content);
        const transformed = await this.transformAIResponse(suggestion);
        return AITripSuggestionSchema.parse(transformed);
      } catch (error) {
        console.error('Failed to generate trip suggestion:', error);
        retries++;
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('AI generation timed out. Please try again.');
        }
        if (retries === this.MAX_RETRIES) throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, this.RETRY_DELAY * Math.pow(2, retries)),
        );
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
