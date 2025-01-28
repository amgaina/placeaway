'use server';

import * as z from 'zod';
import { currentUser } from '@/lib/auth';
import { ChatMessageSchema, TripPreferenceSchema } from '@/schemas/trip';
import { ChatService } from '@/services/ChatService';
import TripAIService from '@/services/TripAIService';
import { Trip } from '@prisma/client';

export const generateTripSuggestion = async (
  values: z.infer<typeof TripPreferenceSchema>,
  trip: Trip,
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: 'Unauthorized' };
    }

    const suggestion = await TripAIService.generateTripSuggestion(
      values.preferences,
      trip,
    );

    return { success: 'Suggestion generated', data: suggestion };
  } catch (error) {
    return { error: 'Failed to generate suggestion' };
  }
};

export const processChatMessage = async (
  tripId: string,
  values: z.infer<typeof ChatMessageSchema>[],
): Promise<{ error?: string; success?: string; data?: any }> => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: 'Unauthorized' };
    }

    // Verify trip ownership using service
    const isOwner = await ChatService.verifyTripOwnership(tripId, user.id);
    if (!isOwner) {
      return { error: 'Trip not found' };
    }

    // Process chat using service
    const response = await ChatService.processMessage(tripId, {
      content: values[values.length - 1].content,
      role: 'USER',
    });

    return { success: 'Message processed', data: response };
  } catch (error) {
    return { error: 'Failed to process message' };
  }
};
