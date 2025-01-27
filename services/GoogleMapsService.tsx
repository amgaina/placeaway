import {
  Client,
  PlaceInputType,
  PlaceDetailsResponse,
  FindPlaceFromTextResponse,
  PlacesNearbyResponse,
  PlacesNearbyRanking,
} from '@googlemaps/google-maps-services-js';

export interface PlaceDetails {
  photos: string[];
  reviews: PlaceReviewData[];
  rating: number;
  userRatingsTotal: number;
}

export interface PlaceReviewData {
  author: string;
  rating: number;
  text: string;
  time: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class GoogleMapsService {
  private static readonly API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  private static readonly client = new Client({});

  private static cache = new Map<string, CacheEntry<PlaceDetails>>();
  private static readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

  static async getPlaceDetails(location: string): Promise<PlaceDetails> {
    if (!this.API_KEY) {
      throw new Error('Google Maps API key is not configured');
    }

    const cacheKey = `place_${location}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const placeResponse = await this.client.findPlaceFromText({
        params: {
          input: location,
          inputtype: PlaceInputType.textQuery,
          fields: ['place_id'],
          key: this.API_KEY,
        },
      });

      if (!placeResponse.data.candidates?.[0]?.place_id) {
        throw new Error(`No place found for location: ${location}`);
      }

      const detailsResponse = await this.client.placeDetails({
        params: {
          place_id: placeResponse.data.candidates[0].place_id,
          fields: ['photos', 'reviews', 'rating', 'user_ratings_total'],
          key: this.API_KEY,
        },
      });

      const transformed = this.transformPlaceDetails(detailsResponse.data);
      this.cache.set(cacheKey, {
        data: transformed,
        timestamp: Date.now(),
      });

      return transformed;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch place details: ${error.message}`);
      }
      throw new Error('Failed to fetch place details: Unknown error');
    }
  }

  private static transformPlaceDetails(
    response: PlaceDetailsResponse['data'],
  ): PlaceDetails {
    const result = response.result;
    return {
      photos:
        result.photos?.map((photo) =>
          this.generatePhotoUrl(photo.photo_reference),
        ) ?? [],
      reviews:
        result.reviews?.map((review) => ({
          author: review.author_name,
          rating: review.rating,
          text: review.text,
          time: new Date(Number(review.time) * 1000).toISOString(),
        })) ?? [],
      rating: result.rating ?? 0,
      userRatingsTotal: result.user_ratings_total ?? 0,
    };
  }

  private static generatePhotoUrl(photoReference: string): string {
    // This should ideally be proxied through your backend
    return `/api/places/photo?reference=${photoReference}`;
  }

  static async searchNearbyPlaces(
    lat: number,
    lng: number,
    radius: number = 1000,
  ): Promise<PlacesNearbyResponse['data']['results']> {
    if (!this.API_KEY) {
      throw new Error('Google Maps API key is not configured');
    }

    try {
      const response = await this.client.placesNearby({
        params: {
          location: { lat, lng },
          radius,
          key: this.API_KEY,
          rankby: PlacesNearbyRanking.prominence,
        },
      });

      return response.data.results;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search nearby places: ${error.message}`);
      }
      throw new Error('Failed to search nearby places: Unknown error');
    }
  }
}
