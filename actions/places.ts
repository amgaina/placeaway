'use server';

import { GoogleMapsService } from '@/services/GoogleMapsService';

export async function getPlaceDetails(location: string) {
  try {
    const details = await GoogleMapsService.getPlaceDetails(location);
    return { success: true, data: details };
  } catch (error) {
    console.error('Failed to fetch place details:', error);
    return { success: false, error: 'Failed to fetch place details' };
  }
}
