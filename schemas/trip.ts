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
    destination: z.string().optional(),
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
  startTime: z.date(),
  endTime: z.date(),
  location: z.string(),
  cost: z.number(),
});

export const ItinerarySchema = z.object({
  day: z.number().min(1),
  date: z.date(),
  activities: z.array(ActivitySchema),
});

export type TripPreferenceInput = z.infer<typeof TripPreferenceSchema>;
export type BudgetInput = z.infer<typeof BudgetSchema>;
export type ItineraryInput = z.infer<typeof ItinerarySchema>;

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

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
  recommendations: z.array(z.string()),
  itinerary: z.array(
    z.object({
      day: z.number(),
      activities: z.array(ActivitySchema),
      date: z.string(),
    }),
  ),
});

export type AITripSuggestion = z.infer<typeof AITripSuggestionSchema>;

export const ChatMessageSchema = z.object({
  content: z.string().min(1),
  role: z.enum(['USER', 'ASSISTANT']),
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;
