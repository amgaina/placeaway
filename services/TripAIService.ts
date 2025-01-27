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

  private static readonly SYSTEM_PROMPT = `You are an AI travel planner that generates detailed trip itineraries in JSON format.

Required Response Structure:
{
  "destination": string,
  "activities": [{
    "title": string,
    "description": string,
    "startTime": string (ISO datetime),
    "endTime": string (ISO datetime),
    "location": string (full address),
    "lat": number | null,
    "lng": number | null,
    "cost": number,
    "type": "ATTRACTION" | "MEAL" | "TRANSPORT" | "BREAK" | "ACCOMMODATION",
    "timeSlot": "MORNING" | "AFTERNOON" | "EVENING",
    "status": "PENDING"
  }],
  "budget": {
    "total": number,
    "accommodation": number,
    "transport": number,
    "activities": number,
    "food": number,
    "other": number
  },
  "recommendations": [{
    "title": string,
    "description": string,
    "category": "TRANSPORT" | "ACCOMMODATION" | "FOOD" | "ACTIVITIES" | "SAFETY" | "GENERAL" | "OTHER",
    "priority": "LOW" | "MEDIUM" | "HIGH",
    "status": "PENDING"
  }],
  "itinerary": [{
    "day": number,
    "date": string (YYYY-MM-DD),
    "weatherNote": string,
    "activities": [Activity objects],
    "tips": string[]
  }]
}

Validation Rules:
1. All activities must have valid locations for geocoding
2. Times must be in ISO format
3. Costs must be positive numbers
4. Each day must have activities spread across timeSlots
5. Budget must account for all activities
6. At least 3 recommendations per trip
7. Activities must have appropriate type and timeSlot
8. Each day should have 2-3 relevant tips

Response must be valid JSON with all required fields.`;

  private static readonly TIMEOUT = 360000; // 6 minutes
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 2000; // 2 seconds

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
    this.log('Getting coordinates for:', location);
    try {
      const startTime = Date.now();
      const response = await this.geocoder.geocode({
        params: {
          address: location,
          key: process.env.GOOGLE_MAPS_API_KEY!,
        },
      });
      this.log('Geocoding response time:', `${Date.now() - startTime}ms`);
      this.log(
        'Geocoding response:',
        response.data.results[0]?.geometry?.location,
      );

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

  static async transformActivityWithCoordinates(
    activity: AIActivity,
  ): Promise<AIActivity> {
    try {
      const coordinates: AILocation | null = activity.location
        ? await this.getCoordinates(activity.location)
        : null;

      return {
        title: activity.title,
        description: activity.description ?? null,
        startTime:
          this.parseDateTime(activity.startTime ?? null)?.toISOString() ?? null,
        endTime:
          this.parseDateTime(activity.endTime ?? null)?.toISOString() ?? null,
        location: activity.location ?? null,
        lat: coordinates?.lat ?? null,
        lng: coordinates?.lng ?? null,
        cost: activity.cost ?? null,
        type: activity.type || 'ATTRACTION',
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

      return TripService.getTripWithDetails(tripId);
    });
  }

  private static async retryWithBackoff(
    operation: () => Promise<any>,
    retryCount: number = 0,
  ): Promise<any> {
    try {
      return await operation();
    } catch (error) {
      if (retryCount >= this.MAX_RETRIES) throw error;

      await new Promise((resolve) =>
        setTimeout(resolve, this.RETRY_DELAY * Math.pow(2, retryCount)),
      );

      return this.retryWithBackoff(operation, retryCount + 1);
    }
  }

  private static validateAndLogResponse(response: any) {
    try {
      // Step 2: Validate basic structure
      if (!response) {
        this.log('Error: Empty response');
        throw new Error('Empty AI response');
      }

      // Step 3: Parse if string
      let parsedResponse =
        typeof response === 'string' ? JSON.parse(response) : response;

      // Step 4: Validate required fields
      const requiredFields = [
        'activities',
        'itinerary',
        'recommendations',
        'budget',
      ];
      const missingFields = requiredFields.filter(
        (field) => !parsedResponse[field],
      );
      if (missingFields.length > 0) {
        this.log('Error: Missing required fields:', missingFields);
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Step 5: Log structure details
      this.log('Response structure:', {
        activitiesCount: parsedResponse.activities?.length || 0,
        itineraryDays: parsedResponse.itinerary?.length || 0,
        recommendationsCount: parsedResponse.recommendations?.length || 0,
        hasBudget: !!parsedResponse.budget,
      });

      return parsedResponse;
    } catch (error) {
      this.log('Validation error:', error);
      throw error;
    }
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
- Destination: ${preferences.destination}
- Starting from: ${preferences.origin || 'Not specified'}
- Trip dates: ${format(trip.startDate ?? new Date(), 'PPP')} to ${format(trip.endDate ?? new Date(), 'PPP')}

Group Details:
- Size: ${preferences.visitorCount} people
- Type: ${preferences.hasChildren ? 'Family with children' : 'Adults only'}
${preferences.hasPets ? '- Special: Traveling with pets' : ''}


Interests:
${preferences.interests.map((interest) => `- ${interest}`).join('\n')}


Special Requirements:
${preferences.hasPets ? '- Pets: Please include pet-friendly activities' : ''}
${preferences.hasChildren ? '- Children: Include family-friendly activities' : ''}

}`;
  }

  static async generateTripSuggestion(
    preferences: TripPreferenceInput['preferences'],
    trip: Trip,
  ) {
    return this.retryWithBackoff(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        this.log('Request timed out after', format(new Date(), 'HH:mm:ss'));
        controller.abort();
      }, this.TIMEOUT);

      try {
        this.log('Starting AI request with preferences:', preferences);

        const completion = await this.openai.chat.completions.create(
          {
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: this.SYSTEM_PROMPT },
              {
                role: 'user',
                content: this.buildPrompt(preferences, trip),
              },
            ],
            temperature: 0.3,
            max_tokens: 4000,
            stream: false,
            response_format: {
              type: 'json_object',
            },
          },
          { signal: controller.signal },
        );
        this.log('AI response:', completion.choices);

        const response = completion.choices[0]?.message?.content;

        const validatedResponse = this.validateAndLogResponse(response);
        this.log('Validated response:', validatedResponse);

        return validatedResponse;
      } finally {
        clearTimeout(timeoutId);
      }
    });
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
