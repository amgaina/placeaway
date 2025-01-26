import { Trip, TripStatus, Budget, Itinerary } from '@prisma/client';
import { db } from '@/lib/db';
import {
  TripPreferenceInput,
  BudgetInput,
  ItineraryInput,
  AITripSuggestion,
  TripWithPreferencesAndBudget,
} from '@/schemas/trip';
import TripAIService from './TripAIService';

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

  static async updateTrip(
    tripId: string,
    data: Partial<TripPreferenceInput>,
  ): Promise<Trip> {
    return db.trip.update({
      where: { id: tripId },
      data: {
        ...data,
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
  ): Promise<TripWithPreferencesAndBudget[]> {
    return db.trip.findMany({
      where: { userId },
      include: {
        preferences: true,
        budget: true,
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
        ...data,
        date: data.date || new Date(),
        tripId,
        activities: {
          create: data.activities.map((activity) => ({
            ...activity,
            startTime: activity.startTime,
            endTime: activity.endTime,
          })),
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

  static async getTripWithDetails(tripId: string) {
    const trip = await db.trip.findUnique({
      where: { id: tripId },
      include: {
        preferences: true,
        budget: true,
        itineraries: {
          include: {
            activities: true,
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

    if (!trip.hasAISuggestions) {
      if (!trip.preferences) throw new Error('Trip preferences not found');
      // Generate AI suggestions if missing
      const { origin, destination, ...rest } = trip.preferences;

      if (!destination) {
        throw new Error('Trip destination is required');
      }

      const suggestions = await TripAIService.generateTripSuggestion({
        ...rest,
        origin: origin || undefined,
        destination: destination,
      });

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
  ) {
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
          category: rec.category,
          priority: rec.priority,
          status: 'PENDING',
        })),
      });

      // Create budget
      await tx.budget.upsert({
        where: { tripId },
        create: {
          tripId,
          total: Object.values(suggestions.budget).reduce((a, b) => a + b, 0),
          ...suggestions.budget,
        },
        update: {
          total: Object.values(suggestions.budget).reduce((a, b) => a + b, 0),
          ...suggestions.budget,
        },
      });

      // Create itineraries with activities
      for (const day of suggestions.itinerary) {
        const itinerary = await tx.itinerary.create({
          data: {
            tripId,
            day: day.day,
            date: day.date || new Date(),
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
            cost: activity.cost,
          })),
        });
      }

      return tx.trip.findUnique({
        where: { id: tripId },
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
    });
  }

  static async deleteTrip(tripId: string): Promise<Trip> {
    return db.trip.delete({
      where: { id: tripId },
    });
  }
}
