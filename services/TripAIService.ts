import { OpenAI } from 'openai';
import {
  AIMessage,
  AITripSuggestionSchema,
  RecommendationCategory,
  TripPreferenceInput,
} from '@/schemas/trip';
import { z } from 'zod';
import { Client } from '@googlemaps/google-maps-services-js';
import {
  RecommendationPriority,
  RecommendationStatus,
  Trip,
  ActivityType,
} from '@prisma/client';
import {
  AITripSuggestion,
  AIActivity,
  AIItineraryDay,
  AILocation,
} from '@/types/ai';
import { TripWithDetails } from '@/types/trip';
import { db } from '@/lib/db';
import { TripService } from './TripService';
import { differenceInDays, format } from 'date-fns';

export default class TripAIService {
  private static openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  private static readonly DATE_FORMAT = 'yyyy-MM-dd';
  private static readonly TIME_FORMAT = 'HH:mm:ss';

  private static readonly SYSTEM_PROMPT = `Generate a structured travel itinerary in valid JSON format based on the following schema. Ensure all values adhere to the specified constraints.

Schema:
json
Copy
Edit
{
  "destination": "string",
  "budget": {
    "total": number,
    "accommodation": number,
    "transport": number,
    "activities": number,
    "food": number,
    "other": number
  },
  "recommendations": [
    {
      "title": "string (max 50 chars)",
      "description": "string (max 200 chars)",
      "category": "TRANSPORT" | "ACCOMMODATION" | "FOOD" | "ACTIVITIES" | "SAFETY" | "GENERAL" | "OTHER",
      "priority": "LOW" | "MEDIUM" | "HIGH",
      "status": "PENDING"
    }
  ],
  "itinerary": [
    {
      "day": number,
      "date": "YYYY-MM-DD",
      "weatherNote": "string?",
      "tips": ["string"],
      "activities": [
        {
          "title": "string (max 50 chars)",
          "description": "string (max 200 chars)",
          "startTime": "ISO 8601",
          "endTime": "ISO 8601",
          "location": "string",
          "cost": number,
          "feedback": "string?",
          "type": "ATTRACTION" | "MEAL" | "TRANSPORT" | "BREAK" | "ACCOMMODATION",
          "timeSlot": "MORNING" | "AFTERNOON" | "EVENING"
        }
      ]
    }
  ]
}
Rules:
Minimum 3 recommendations required.
Activities must be distributed across MORNING, AFTERNOON, and EVENING time slots.
For trips longer than 3 days, only a 3-day itinerary is generated; otherwise, include all days.
Each day must have at least 1 tip.
All costs must be numbers.
Dates must follow ISO format (YYYY-MM-DD).
Enum values must match exactly as specified.
Generate the output in valid JSON format only.`;

  private static readonly MAX_RETRIES = 1;

  private static geocoder = new Client({});

  private static readonly DEBUG = process.env.NODE_ENV === 'development';

  private static log(message: string, data?: any) {
    if (this.DEBUG) {
      console.log(
        `[TripAI] ${message}`,
        data ? JSON.stringify(data, null, 2) : '',
      );
    }
  }

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
      this.log('Geocoding error:', error);
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

  private static mapActivityType(type: string): ActivityType {
    try {
      // Direct mapping to Prisma enum
      const validTypes: Record<string, ActivityType> = {
        ATTRACTION: 'ATTRACTION',
        MEAL: 'MEAL',
        TRANSPORT: 'TRANSPORT',
        BREAK: 'BREAK',
        ACCOMMODATION: 'ACCOMMODATION',
        ACTIVITIES: 'ACTIVITIES',
      };

      const upperType = type?.toUpperCase();
      return validTypes[upperType] || 'ATTRACTION';
    } catch {
      return 'ATTRACTION';
    }
  }

  static async transformActivityWithCoordinates(
    activity: AIActivity,
  ): Promise<AIActivity> {
    try {
      const coordinates = activity.location
        ? await this.getCoordinates(activity.location)
        : null;

      return {
        ...activity,
        lat: coordinates?.lat ?? null,
        lng: coordinates?.lng ?? null,
        type: this.mapActivityType(activity.type || 'ATTRACTION'),
        timeSlot: activity.timeSlot || 'MORNING',
        status: 'PENDING',
        rating: 0,
        feedback: null,
      };
    } catch (error) {
      console.error('Activity transform error:', error);
      throw new Error(`Failed to transform activity: ${activity.title}`);
    }
  }

  static async transformAIResponse(response: any): Promise<AITripSuggestion> {
    try {
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid AI response format');
      }

      const activities = await Promise.all(
        (response.activities || []).map(
          this.transformActivityWithCoordinates.bind(this),
        ),
      );

      const itinerary = await Promise.all(
        (response.itinerary || []).map(async (day: AIItineraryDay) => ({
          day: day.day,
          date: day.date,
          weatherNote: day.weatherNote ?? null,
          tips: Array.isArray(day.tips) ? day.tips : [],
          activities: await Promise.all(
            (day.activities || []).map(
              this.transformActivityWithCoordinates.bind(this),
            ),
          ),
        })),
      );

      return {
        destination: response.destination || '',
        activities,
        budget: {
          total: Number(response.budget?.total) || 0,
          accommodation: Number(response.budget?.accommodation) || 0,
          transport: Number(response.budget?.transport) || 0,
          activities: Number(response.budget?.activities) || 0,
          food: Number(response.budget?.food) || 0,
          other: Number(response.budget?.other) || 0,
        },
        recommendations: (response.recommendations || []).map((rec: any) => ({
          title: rec?.title || 'Untitled',
          description: rec?.description || '',
          category: rec?.category || 'GENERAL',
          priority: rec?.priority || 'MEDIUM',
        })),
        itinerary,
      };
    } catch (error) {
      console.error('Transform error:', error);
      throw new Error('Failed to transform AI response');
    }
  }

  static async updateTripWithAISuggestions(
    tripId: string,
    suggestions: AITripSuggestion,
  ): Promise<TripWithDetails> {
    return db.$transaction(async (tx) => {
      // Update trip status
      await tx.trip.update({
        where: { id: tripId },
        data: {
          hasAISuggestions: true,
          aiGeneratedAt: new Date(),
        },
      });

      // Create recommendations if they exist
      if (suggestions.recommendations?.length) {
        await tx.tripRecommendation.createMany({
          data: suggestions.recommendations.map((rec) => ({
            tripId,
            title: rec.title || 'Untitled',
            description: rec.description || '',
            category: (rec.category as RecommendationCategory) || 'GENERAL',
            priority: (rec.priority as RecommendationPriority) || 'MEDIUM',
            status: 'PENDING' as RecommendationStatus,
          })),
        });
      }

      // Create itineraries with activities
      if (suggestions.itinerary?.length) {
        for (const day of suggestions.itinerary) {
          const itinerary = await tx.itinerary.create({
            data: {
              tripId,
              day: day.day,
              date: day.date ? new Date(day.date) : new Date(),
              weatherNote: day.weatherNote || null,
              tips: day.tips || [],
            },
          });

          if (day.activities?.length) {
            await tx.activity.createMany({
              data: day.activities.map((activity) => ({
                itineraryId: itinerary.id,
                title: activity.title,
                description: activity.description || null,
                startTime: activity.startTime || null,
                endTime: activity.endTime || null,
                location: activity.location || null,
                lat: activity.lat || null,
                lng: activity.lng || null,
                cost: activity.cost || null,
                status: 'PENDING',
                type: activity.type || 'ATTRACTION',
                timeSlot: activity.timeSlot || 'MORNING',
              })),
            });
          }
        }
      }

      const trip = await TripService.getTripWithDetails(tripId);
      if (!trip) throw new Error('Failed to update trip with AI suggestions');
      return trip;
    });
  }

  private static buildPrompt(
    preferences: TripPreferenceInput['preferences'],
    trip: Trip,
  ): string {
    const tripDuration =
      trip.endDate && trip.startDate
        ? differenceInDays(
            trip.endDate ?? new Date(),
            trip.startDate ?? new Date(),
          )
        : 7;

    return `Create a ${tripDuration}-day trip itinerary as a JSON object for:

Location Details:
Destination: ${preferences.destination}
Starting from: ${preferences.origin || 'Not specified'}
Trip dates: ${format(trip.startDate ?? new Date(), 'PPP')} to ${format(trip.endDate ?? new Date(), 'PPP')}
Group Details:
Size: ${preferences.visitorCount} people
Type: ${preferences.hasChildren ? 'Family with children' : 'Adults only'}
${preferences.hasPets ? '- Special: Traveling with pets' : ''}
Interests:
${preferences.interests.map((interest) => `- ${interest}`).join('\n')}

Special Requirements:
${preferences.hasPets ? '- Pets: Please include pet-friendly activities' : ''}
${preferences.hasChildren ? '- Children: Include family-friendly activities' : ''}`;
  }

  private static readonly MAX_RESPONSE_SIZE = 10000;

  private static cleanAndValidateJSON(content: string): string {
    // Remove any trailing characters
    let cleaned = content.trim();

    // Validate JSON structure
    try {
      cleaned = JSON.parse(cleaned);
      return cleaned;
    } catch (e) {
      throw new Error('Invalid JSON structure');
    }
  }

  static async generateTripSuggestion(
    preferences: TripPreferenceInput['preferences'],
    trip: Trip,
  ) {
    const controller = new AbortController();
    let retries = 0;

    while (retries < this.MAX_RETRIES) {
      try {
        const completion = await this.openai.chat.completions.create(
          {
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: this.SYSTEM_PROMPT },
              { role: 'user', content: this.buildPrompt(preferences, trip) },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
            max_tokens: 2000, // Reduced to prevent truncation
          },
          { signal: controller.signal },
        );

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('Empty response from AI');

        const suggestion = this.cleanAndValidateJSON(content);

        const transformed = await this.transformAIResponse(suggestion);
        return transformed;
      } catch (error) {
        console.error('Failed to generate trip suggestion:', error);
        retries++;
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('AI generation timed out. Please try again.');
        }
        if (retries === this.MAX_RETRIES) return null;
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
      }
    }
    return null;
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

  static async test(tripId: string) {
    const trip = await db.trip.findUnique({
      where: { id: tripId },
      include: { preferences: true },
    });

    if (!trip || !trip.preferences)
      throw new Error('Trip or preferences not found');

    const client = this.buildPrompt(
      {
        ...trip.preferences,
        origin: trip.preferences.origin || undefined,
        destination: trip.preferences.destination || 'Unknown',
      },
      trip,
    );
    const completion = await this.openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: this.SYSTEM_PROMPT },
        { role: 'user', content: client },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return JSON.stringify(completion.choices[0].message.content);
  }
}
