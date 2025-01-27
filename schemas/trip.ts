import {
  Activity,
  Budget,
  Itinerary,
  Trip,
  TripRecommendation,
} from '@prisma/client';
import { z } from 'zod';
import { ActivityStatus, TimeSlot, ActivityType } from '@prisma/client';

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

export const ActivityStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'COMPLETED',
]);

export const AttachmentSchema = z.object({
  type: z.string(),
  url: z.string(),
  filename: z.string(),
});

export const AttachmentCreateSchema = z.object({
  url: z.string(),
  type: z.string(),
  filename: z.string(),
});

export const LocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const ActivitySchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
  startTime: z.string().nullable(), // Changed from date to string
  endTime: z.string().nullable(), // Changed from date to string
  location: z.string().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  cost: z.number().nullable(),
  status: z.nativeEnum(ActivityStatus).default('PENDING'),
  rating: z.number().min(0).max(5).default(0),
  feedback: z.string().nullable(),
  timeSlot: z.nativeEnum(TimeSlot).default('MORNING'),
  type: z.nativeEnum(ActivityType).default('ATTRACTION'),
  attachments: z.array(AttachmentSchema).optional(),
});

export const ActivityCreateSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  location: z.string().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  cost: z.number().nullable(),
  status: z
    .enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'])
    .default('PENDING'),
  type: z
    .enum(['ATTRACTION', 'MEAL', 'TRANSPORT', 'BREAK', 'ACCOMMODATION'])
    .default('ATTRACTION'),
  timeSlot: z.enum(['MORNING', 'AFTERNOON', 'EVENING']).default('MORNING'),
  attachments: z
    .array(
      z.object({
        url: z.string(),
        type: z.string(),
        filename: z.string(),
      }),
    )
    .optional(),
});

// Update ItinerarySchema
export const ItinerarySchema = z.object({
  day: z.number().min(1),
  date: z.string().nullable(), // Changed from date to string
  activities: z.array(ActivitySchema),
  weatherNote: z.string().nullable(),
  tips: z.array(z.string()).optional(),
});

export const ItineraryCreateSchema = z.object({
  day: z.number(),
  date: z.date(),
  weatherNote: z.string().nullable(),
  tips: z.array(z.string()),
  activities: z.array(ActivityCreateSchema),
});

export type TripPreferenceInput = z.infer<typeof TripPreferenceSchema>;
export type BudgetInput = z.infer<typeof BudgetSchema>;
export type ItineraryInput = z.infer<typeof ItinerarySchema>;
export type ActivityCreateInput = z.infer<typeof ActivityCreateSchema>;
export type ItineraryCreateInput = z.infer<typeof ItineraryCreateSchema>;

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
  budget: z.record(z.number()),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      priority: z.string(),
    }),
  ),
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
