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
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  location: z.string().optional(),
  cost: z.number().optional(),
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

export interface AITripSuggestion {
  destination: string;
  activities: string[];
  budget: {
    accommodation: number;
    transport: number;
    activities: number;
    food: number;
    other: number;
  };
  recommendations: string[];
}

export const ChatMessageSchema = z.object({
  content: z.string().min(1),
  role: z.enum(['user', 'assistant']),
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;
