import { Trip, TripStatus, Budget, Itinerary } from '@prisma/client';
import { db } from '@/lib/db';
import {
  TripPreferenceInput,
  BudgetInput,
  ItineraryInput,
  AITripSuggestion,
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

  static async getUserTrips(userId: string): Promise<Trip[]> {
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
        tripId,
        activities: {
          create: data.activities,
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
    return db.trip.update({
      where: { id: tripId },
      data: {
        hasAISuggestions: true,
        aiGeneratedAt: new Date(),
        budget: {
          create: {
            ...suggestions.budget,
            total: Object.values(suggestions.budget).reduce(
              (sum, value) => sum + value,
              0,
            ),
          },
        },
        itineraries: {
          create: suggestions.itinerary.map((day) => ({
            day: day.day,
            date: day.date ? new Date(day.date) : new Date(),
            activities: {
              create: day.activities.map((activity) => ({
                title: typeof activity === 'string' ? activity : activity.title,
                description:
                  typeof activity === 'string' ? '' : activity.description,
                startTime:
                  typeof activity === 'string'
                    ? new Date()
                    : new Date(activity.startTime),
                endTime:
                  typeof activity === 'string'
                    ? new Date()
                    : new Date(activity.endTime),
                location: typeof activity === 'string' ? '' : activity.location,
                cost: typeof activity === 'string' ? 0 : activity.cost,
              })),
            },
          })),
        },
      },
    });
  }

  static async deleteTrip(tripId: string): Promise<Trip> {
    return db.trip.delete({
      where: { id: tripId },
    });
  }
}
