import {
  Trip,
  TripStatus,
  Budget,
  Itinerary,
  Prisma,
  RecommendationStatus,
} from '@prisma/client';
import { db } from '@/lib/db';
import {
  TripPreferenceInput,
  BudgetInput,
  ItineraryInput,
  TripWithPreferencesAndBudgetAndTripRecommendation,
  RecommendationCategory,
  RecommendationPriority,
} from '@/schemas/trip';
import TripAIService from './TripAIService';
import { TripWithDetails } from '@/types/trip';
import { AITripSuggestion } from '@/types/ai';

export class TripService {
  static async createTrip(
    userId: string,
    data: TripPreferenceInput,
  ): Promise<Trip> {
    return db.trip.create({
      data: {
        userId,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
        preferences: {
          create: data.preferences,
        },
      },
    });
  }

  static async getUserTrip(userId: string, tripId: string): Promise<Trip> {
    const trip = await db.trip.findFirst({
      where: { userId, id: tripId },
    });

    if (!trip) throw new Error('Trip not found');
    return trip;
  }

  static async updateTrip(
    tripId: string,
    data: Partial<TripPreferenceInput>,
    hasAISuggestions = false,
  ): Promise<Trip> {
    return db.trip.update({
      where: { id: tripId },
      data: {
        ...data,
        hasAISuggestions: hasAISuggestions,
        preferences: data.preferences
          ? {
              update: data.preferences,
            }
          : undefined,
      },
    });
  }

  static async getUserTrips(
    userId: string,
  ): Promise<TripWithPreferencesAndBudgetAndTripRecommendation[]> {
    return db.trip.findMany({
      where: { userId },
      include: {
        preferences: true,
        budget: true,
        recommendations: true,
        itineraries: {
          include: {
            activities: true,
          },
        },
      },
    });
  }

  static async updateBudget(
    tripId: string,
    data: BudgetInput,
  ): Promise<Budget> {
    return db.budget.upsert({
      where: { tripId },
      update: data,
      create: {
        ...data,
        tripId,
      },
    });
  }

  static async addItinerary(
    tripId: string,
    data: ItineraryInput,
  ): Promise<Itinerary> {
    return db.itinerary.create({
      data: {
        tripId,
        day: data.day,
        date: data.date || new Date(),
        activities: {
          create: data.activities.map((activity) => ({
            title: activity.title,
            description: activity.description,
            startTime: activity.startTime,
            endTime: activity.endTime,
            location: activity.location,
            lat: activity.lat,
            lng: activity.lng,
            cost: activity.cost,
            status: activity.status,
            type: activity.type,
            timeSlot: activity.timeSlot,
            attachments: activity.attachments
              ? {
                  create: activity.attachments.map((attachment) => ({
                    url: attachment.url,
                    type: attachment.type,
                    filename: attachment.filename,
                  })),
                }
              : undefined,
          })),
        },
      },
      include: {
        activities: {
          include: {
            attachments: true,
          },
        },
      },
    });
  }

  static async updateTripStatus(
    tripId: string,
    status: TripStatus,
  ): Promise<Trip> {
    return db.trip.update({
      where: { id: tripId },
      data: { status },
    });
  }

  static async getTripWithDetails(
    tripId: string,
    reGenerateAISuggestion = true,
  ): Promise<TripWithDetails | null> {
    try {
      console.log('1. Starting getTripWithDetails');

      if (!tripId) {
        console.log('2. No tripId provided');
        throw new Error('Trip ID is required');
      }

      console.log('3. Finding trip:', tripId);
      const trip = await db.$transaction(async (tx) => {
        const result = await tx.trip.findUnique({
          where: { id: tripId },
          include: {
            preferences: true,
            budget: true,
            itineraries: {
              include: {
                activities: {
                  include: {
                    attachments: true,
                  },
                },
              },
            },
            recommendations: true,
            chatSessions: {
              include: {
                messages: true,
              },
            },
          },
        });

        console.log('4. Database query completed');
        return result;
      });

      console.log('5. Trip found:', !!trip);
      if (!trip) {
        return null;
      }

      console.log('6. Checking AI suggestions');
      if (!trip.hasAISuggestions && reGenerateAISuggestion) {
        if (!trip.preferences) {
          throw new Error('Trip preferences not found');
        }

        const { origin, destination, ...rest } = trip.preferences;

        if (!destination) {
          throw new Error('Trip destination is required');
        }
        console.log('7. Generating AI suggestions');
        const suggestions = await TripAIService.generateTripSuggestion(
          {
            ...rest,
            origin: origin || undefined,
            destination,
          },
          trip,
        );

        console.log('8. AI suggestions generated:', !!suggestions);
        if (suggestions) {
          console.log('9. Updating trip with AI suggestions');
          const updatedTrip = await this.updateTripWithAISuggestions(
            tripId,
            suggestions,
          );
          console.log('10. Trip updated with AI suggestions');
          return updatedTrip;
        } else {
          throw new Error('Failed to generate AI suggestions');
        }
      }

      return trip;
    } catch (error) {
      console.error('❌ getTripWithDetails error:', error);
      throw error;
    }
  }

  static async updateTripWithAISuggestions(
    tripId: string,
    suggestions: AITripSuggestion,
  ): Promise<TripWithDetails | null> {
    const debug = (message: string) => console.log(`[Debug] ${message}`);

    try {
      debug('Starting transaction');

      const result = await db.$transaction(
        async (tx) => {
          try {
            // 1. Update trip
            await tx.trip.update({
              where: { id: tripId },
              data: {
                hasAISuggestions: true,
                aiGeneratedAt: new Date(),
              },
            });
            debug('1. Trip updated');

            // 2. Update budget
            if (suggestions.budget) {
              await tx.budget.upsert({
                where: { tripId },
                update: suggestions.budget,
                create: { ...suggestions.budget, tripId },
              });
              debug('2. Budget updated');
            }

            // 3. Create recommendations
            if (suggestions.recommendations?.length) {
              await tx.tripRecommendation.createMany({
                data: suggestions.recommendations.map((rec) => ({
                  tripId,
                  title: rec.title,
                  description: rec.description,
                  category: rec.category,
                  priority: rec.priority,
                  status: 'PENDING',
                })),
              });
              debug('3. Recommendations created');
            }

            // 4. Create itineraries with validation
            if (suggestions.itinerary?.length) {
              for (const day of suggestions.itinerary) {
                const itinerary = await tx.itinerary.create({
                  data: {
                    tripId,
                    day: day.day,
                    date: day.date ? new Date(day.date) : new Date(),
                    weatherNote: day.weatherNote ?? null,
                    tips: day.tips ?? [],
                  },
                });
                debug(`4a. Created itinerary for day ${day.day}`);

                if (day.activities?.length) {
                  await tx.activity.createMany({
                    data: day.activities.map((activity) => ({
                      itineraryId: itinerary.id,
                      title: activity.title,
                      description: activity.description ?? null,
                      startTime: activity.startTime ?? null,
                      endTime: activity.endTime ?? null,
                      location: activity.location ?? null,
                      lat: activity.lat ?? null,
                      lng: activity.lng ?? null,
                      cost: activity.cost ?? 0,
                      status: 'PENDING',
                      type: activity.type ?? 'ATTRACTION',
                      timeSlot: activity.timeSlot ?? 'MORNING',
                    })),
                  });
                  debug(`4b. Created activities for day ${day.day}`);
                }
              }
            }

            // 5. Verify final trip
            const finalTrip = await tx.trip.findUnique({
              where: { id: tripId },
              include: {
                preferences: true,
                budget: true,
                itineraries: {
                  include: {
                    activities: {
                      include: {
                        attachments: true,
                      },
                    },
                  },
                },
                recommendations: true,
                chatSessions: {
                  include: {
                    messages: true,
                  },
                },
              },
            });

            if (!finalTrip) {
              throw new Error('Failed to verify final trip state');
            }
            debug('5. Final trip verification successful');

            return finalTrip;
          } catch (txError) {
            debug(`Transaction error: ${txError}`);
            throw txError;
          }
        },
        {
          timeout: 30000,
          maxWait: 10000,
        },
      );

      debug('Transaction completed successfully');
      return result;
    } catch (error) {
      debug(`Fatal error: ${error}`);
      throw error;
    }
  }

  static async deleteTrip(tripId: string): Promise<Trip> {
    return db.trip.delete({
      where: { id: tripId },
    });
  }
}
