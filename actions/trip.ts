'use server';

import * as z from 'zod';
import { TripService } from '@/services/TripService';
import {
  TripPreferenceSchema,
  TripUpdateSchema,
  BudgetSchema,
  TripPreferenceInput,
} from '@/schemas/trip';
import { currentUser } from '@/lib/auth';
import TripAIService from '@/services/TripAIService';

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

export async function getLatLangFromAddress(address: string) {
  try {
    const response = await TripAIService.getCoordinates(address);
    if (!response) {
      return { error: 'Failed to fetch coordinates' };
    }
    return { success: 'Coordinates fetched successfully', data: response };
  } catch (error) {
    console.error('Failed to fetch coordinates', error);
    return { error: 'Failed to fetch coordinates' };
  }
}

export async function getUserTrips() {
  try {
    const user = await currentUser();
    if (!user?.id) return { error: 'Unauthorized' };
    console.log('user', user);
    const res = await getLatLangFromAddress('New York');
    console.log('lcoaiton api', res);
    const trips = await TripService.getUserTrips(user.id);
    return { success: 'Trips fetched successfully', data: trips };
  } catch (error) {
    return { error: 'Failed to fetch trips' };
  }
}

export async function getTripWithDetails(tripId: string) {
  try {
    const user = await currentUser();
    if (!user || !user.id) return { error: 'Unauthorized' };

    const trip = await TripService.getTripWithDetails(tripId);

    return { success: 'Trip fetched successfully', data: trip };
  } catch (error) {
    console.log('error', error);
    return { error: 'Failed to fetch trip' };
  }
}

export async function generateTripSuggestions(
  tripId: string,
  data: z.infer<typeof TripPreferenceSchema>,
) {
  try {
    const user = await currentUser();
    if (!user || !user.id) return { error: 'Unauthorized' };

    const suggestions = await TripAIService.generateTripSuggestion(
      data.preferences,
    );

    console.log('suggestions', suggestions);
    if (!suggestions || !suggestions.budget || !suggestions.itinerary) {
      return { error: 'Failed to generate suggestions' };
    }
    const updatedTrip = await TripService.updateTripWithAISuggestions(
      tripId,
      suggestions,
    );

    return { success: 'Suggestions generated successfully', data: updatedTrip };
  } catch (error) {
    return { error: 'Failed to generate suggestions' };
  }
}

export async function updateTripPreferences(
  tripId: string,
  values: z.infer<typeof TripPreferenceSchema>,
) {
  try {
    const user = await currentUser();
    if (!user?.id) return { error: 'Unauthorized' };

    // Set hasAISuggestions to false
    await TripService.updateTrip(tripId, values, true);

    // Generate new AI suggestions
    const suggestions = await TripAIService.generateTripSuggestion(
      values.preferences,
    );

    if (!suggestions) {
      return { error: 'Failed to generate AI suggestions' };
    }
    const updatedTrip = await TripService.updateTripWithAISuggestions(
      tripId,
      suggestions,
    );

    return { success: 'Trip updated successfully', data: updatedTrip };
  } catch (error) {
    return { error: 'Failed to update trip' };
  }
}

export async function deleteTrip(tripId: string) {
  try {
    const user = await currentUser();
    if (!user?.id) return { error: 'Unauthorized' };

    await TripService.deleteTrip(tripId);
    return { success: 'Trip deleted successfully' };
  } catch (error) {
    return { error: 'Failed to delete trip' };
  }
}
