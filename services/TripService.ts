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
  AITripSuggestion,
  TripWithPreferencesAndBudgetAndTripRecommendation,
  RecommendationCategory,
  RecommendationPriority,
} from '@/schemas/trip';
import TripAIService from './TripAIService';
import { TripWithDetails } from '@/types/trip';

interface ActivityCreateInput
  extends Omit<Prisma.ActivityCreateInput, 'itinerary'> {
  attachments?: {
    create: {
      url: string;
      type: string;
      filename: string;
    }[];
  };
}

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
    reGenereteAISuggestion = true,
  ): Promise<TripWithDetails> {
    const trip = await db.trip.findUnique({
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

    if (!trip) throw new Error('Trip not found');

    if (!trip.hasAISuggestions && reGenereteAISuggestion) {
      if (!trip.preferences) throw new Error('Trip preferences not found');
      // Generate AI suggestions if missing
      const { origin, destination, ...rest } = trip.preferences;

      if (!destination) {
        throw new Error('Trip destination is required');
      }

      const suggestions = await TripAIService.generateTripSuggestion(
        {
          ...rest,
          origin: origin || undefined,
          destination: destination,
        },
        trip,
      );

      if (!suggestions) {
        throw new Error('Failed to generate AI suggestions');
      }

      await this.updateTripWithAISuggestions(tripId, suggestions);
      trip.hasAISuggestions = true;
      trip.aiGeneratedAt = new Date();
    }

    return trip;
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

      // Create recommendations
      await tx.tripRecommendation.createMany({
        data: suggestions.recommendations.map((rec) => ({
          tripId,
          title: rec.title,
          description: rec.description,
          category: rec.category as RecommendationCategory,
          priority: rec.priority as RecommendationPriority,
          status: 'PENDING' as RecommendationStatus,
        })),
      });

      // Create itineraries with activities
      for (const day of suggestions.itinerary) {
        const itinerary = await tx.itinerary.create({
          data: {
            tripId,
            day: day.day,
            date: day.date ? new Date(day.date) : new Date(),
            weatherNote: day.weatherNote,
            tips: day.tips,
          },
        });

        await tx.activity.createMany({
          data: day.activities.map((activity) => ({
            itineraryId: itinerary.id,
            title: activity.title,
            description: activity.description,
            startTime: activity.startTime,
            endTime: activity.endTime,
            location: activity.location,
            lat: activity.lat,
            lng: activity.lng,
            cost: activity.cost,
            status: 'PENDING',
            type: activity.type,
            timeSlot: activity.timeSlot,
          })),
        });
      }

      return this.getTripWithDetails(tripId, false);
    });
  }

  static async deleteTrip(tripId: string): Promise<Trip> {
    return db.trip.delete({
      where: { id: tripId },
    });
  }
}
