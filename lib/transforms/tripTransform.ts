import { Trip, Budget, Itinerary, Activity } from '@prisma/client';
import { AITripSuggestion } from '@/schemas/trip';

export function transformTripData(
  trip: Trip & {
    budget: Budget | null;
    preferences: { destination: string | null } | null;
    itineraries: (Itinerary & { activities: Activity[] })[];
    chatSessions: any[];
  },
): AITripSuggestion {
  return {
    destination: trip.preferences?.destination || 'Unknown',
    activities: trip.itineraries.flatMap((i) =>
      i.activities.map((a) => ({
        title: a.title,
        startTime: a.startTime,
        endTime: a.endTime,
        description: a.description ?? '',
        location: a.location ?? '',
        cost: a.cost ?? 0,
      })),
    ),
    budget: {
      accommodation: trip.budget?.accommodation || 0,
      transport: trip.budget?.transport || 0,
      activities: trip.budget?.activities || 0,
      food: trip.budget?.food || 0,
      other: trip.budget?.other || 0,
    },
    recommendations: trip.chatSessions
      .filter((s) => s.messages?.[0]?.role === 'assistant')
      .map((s) => s.messages[0].content),
    itinerary: trip.itineraries.map((i) => ({
      day: i.day,
      activities: i.activities.map((a) => ({
        title: a.title,
        startTime: a.startTime,
        endTime: a.endTime,
        description: a.description ?? '',
        location: a.location ?? '',
        cost: a.cost ?? 0,
      })),
      date: i.date.toISOString(),
    })),
  };
}
