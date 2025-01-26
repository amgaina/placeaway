'use server';

import * as z from 'zod';
import { TripService } from '@/services/TripService';
import {
  TripPreferenceSchema,
  TripUpdateSchema,
  BudgetSchema,
} from '@/schemas/trip';
import { currentUser } from '@/lib/auth';

export async function createTrip(values: z.infer<typeof TripPreferenceSchema>) {
  try {
    const user = await currentUser();
    if (!user?.id) return { error: 'Unauthorized' };

    const trip = await TripService.createTrip(user.id, values);
    return { success: 'Trip created successfully', data: trip };
  } catch (error) {
    return { error: 'Failed to create trip' };
  }
}

export async function updateTrip(
  tripId: string,
  values: z.infer<typeof TripUpdateSchema>,
) {
  try {
    const user = await currentUser();
    if (!user?.id) return { error: 'Unauthorized' };

    const trip = await TripService.updateTrip(tripId, values);
    return { success: 'Trip updated successfully', data: trip };
  } catch (error) {
    return { error: 'Failed to update trip' };
  }
}

export async function updateTripBudget(
  tripId: string,
  values: z.infer<typeof BudgetSchema>,
) {
  try {
    const user = await currentUser();
    if (!user?.id) return { error: 'Unauthorized' };

    const budget = await TripService.updateBudget(tripId, values);
    return { success: 'Budget updated successfully', data: budget };
  } catch (error) {
    return { error: 'Failed to update budget' };
  }
}

export async function getUserTrips() {
  try {
    const user = await currentUser();
    if (!user?.id) return { error: 'Unauthorized' };

    const trips = await TripService.getUserTrips(user.id);
    return { success: 'Trips fetched successfully', data: trips };
  } catch (error) {
    return { error: 'Failed to fetch trips' };
  }
}
