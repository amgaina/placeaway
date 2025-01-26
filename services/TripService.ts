import { Trip, TripStatus } from '@prisma/client';
import { db } from '@/lib/db';
import { TripPreferenceInput } from '@/schemas/trip';

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
}
