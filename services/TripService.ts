import { Trip, TripStatus, Budget, Itinerary } from '@prisma/client';
import { db } from '@/lib/db';
import {
  TripPreferenceInput,
  BudgetInput,
  ItineraryInput,
} from '@/schemas/trip';

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
    return db.trip.findUnique({
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
            messages: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
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
