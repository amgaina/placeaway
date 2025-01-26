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

export type TripPreferenceInput = z.infer<typeof TripPreferenceSchema>;

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
