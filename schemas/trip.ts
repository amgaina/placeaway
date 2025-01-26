import {
  Activity,
  Budget,
  Itinerary,
  Trip,
  TripRecommendation,
} from '@prisma/client';
import { z } from 'zod';

export const TripPreferenceSchema = z.object({
  title: z.string().min(1),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  preferences: z.object({
    visitorCount: z.number().min(1),
    hasPets: z.boolean(),
    hasChildren: z.boolean(),
    interests: z.array(z.string()),
    origin: z.string().optional(),
    destination: z.string(),
  }),
});

export const TripUpdateSchema = TripPreferenceSchema.partial();

export const BudgetSchema = z.object({
  total: z.number().min(0),
  accommodation: z.number().min(0),
  transport: z.number().min(0),
  activities: z.number().min(0),
  food: z.number().min(0),
  other: z.number().min(0),
});

export const ActivitySchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  location: z.string(),
  cost: z.number(),
});

export const ItinerarySchema = z.object({
  day: z.number().min(1),
  date: z.date().optional(),
  activities: z.array(ActivitySchema),
});

export type TripPreferenceInput = z.infer<typeof TripPreferenceSchema>;
export type BudgetInput = z.infer<typeof BudgetSchema>;
export type ItineraryInput = z.infer<typeof ItinerarySchema>;

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export enum RecommendationCategory {
  TRANSPORT = 'TRANSPORT',
  ACCOMMODATION = 'ACCOMMODATION',
  FOOD = 'FOOD',
  ACTIVITIES = 'ACTIVITIES',
  SAFETY = 'SAFETY',
  GENERAL = 'GENERAL',
  OTHER = 'OTHER',
}

export enum RecommendationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export const RecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.nativeEnum(RecommendationCategory),
  priority: z.nativeEnum(RecommendationPriority),
});

export const AITripSuggestionSchema = z.object({
  destination: z.string(),
  activities: z.array(ActivitySchema),
  budget: z.object({
    accommodation: z.number(),
    transport: z.number(),
    activities: z.number(),
    food: z.number(),
    other: z.number(),
  }),
  recommendations: z.array(RecommendationSchema),
  itinerary: z.array(ItinerarySchema),
});

export type AITripSuggestion = z.infer<typeof AITripSuggestionSchema>;

export const ChatMessageSchema = z.object({
  content: z.string().min(1),
  role: z.enum(['USER', 'ASSISTANT']),
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;

export interface TripWithPreferencesAndBudgetAndTripRecommendation
  extends Trip {
  preferences: {
    visitorCount: number;
    hasPets: boolean;
    hasChildren: boolean;
    interests: string[];
    origin: string | null;
    destination: string | null;
    id: string;
    tripId: string;
  } | null;
  budget: Budget | null;
  recommendations: TripRecommendation[];
  itineraries: (Itinerary & { activities: Activity[] })[];
}
