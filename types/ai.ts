import {
  ActivityStatus,
  ActivityType,
  TimeSlot,
  RecommendationCategory,
  RecommendationPriority,
} from '@prisma/client';

interface AIBase {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AILocation {
  lat: number;
  lng: number;
}

export interface AIBudget extends AIBase {
  total: number;
  accommodation: number;
  transport: number;
  activities: number;
  food: number;
  other: number;
}

export interface AIActivity extends AIBase {
  title: string;
  description?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  location?: string | null;
  lat?: number | null;
  lng?: number | null;
  cost?: number | null;
  type: ActivityType;
  timeSlot: TimeSlot;
  status?: ActivityStatus;
  rating?: number;
  feedback?: string | null;
}

export interface AIItineraryDay extends AIBase {
  day: number;
  date: string;
  weatherNote?: string | null;
  tips: string[];
  activities: AIActivity[];
}

export interface AIRecommendation extends AIBase {
  title: string;
  description: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
}

export interface AITripSuggestion {
  destination: string;
  activities: AIActivity[];
  budget: AIBudget;
  recommendations: AIRecommendation[];
  itinerary: AIItineraryDay[];
}
