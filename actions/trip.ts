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
    const trips = await TripService.getUserTrips(user.id);
    return { success: 'Trips fetched successfully', data: trips };
  } catch (error) {
    return { error: 'Failed to fetch trips' };
  }
}

export async function getTripWithDetails(tripId: string) {
  try {
    if (!tripId) return { error: 'Trip ID is required' };

    const user = await currentUser();
    if (!user || !user.id) return { error: 'Unauthorized' };
    console.log('testing');

    const trip = await TripService.getTripWithDetails(tripId);
    console.log('returning', trip);
    if (!trip) return { error: 'Trip not found' };

    return { success: 'Trip fetched successfully', data: trip };
  } catch (error) {
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
    const trip = await TripService.getUserTrip(user.id, tripId);
    if (!trip) return { error: 'Trip not found' };

    const suggestions = await TripAIService.generateTripSuggestion(
      data.preferences,
      trip,
    );

    console.log('DONE!');
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
    const trip = await TripService.updateTrip(tripId, values, true);

    // Generate new AI suggestions
    const suggestions = await TripAIService.generateTripSuggestion(
      values.preferences,
      trip,
    );

    console.log('suggestions', suggestions);

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
