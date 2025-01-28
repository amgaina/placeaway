import {
  Trip,
  Budget,
  TripPreference,
  TripRecommendation,
  ActivityStatus,
  TimeSlot,
  ActivityType,
  Attachment,
} from '@prisma/client';

export interface Location {
  lat: number;
  lng: number;
}

export interface AttachmentWithoutActivity {
  id: string;
  url: string;
  type: string;
  filename: string;
}

export interface ActivityWithLocation {
  id: string;
  itineraryId: string;
  title: string;
  description: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  cost: number | null;
  status: ActivityStatus;
  type: ActivityType;
  timeSlot: TimeSlot;
  rating: number;
  feedback: string | null;
  attachments: AttachmentWithoutActivity[]; // Made non-optional
}

export interface ItineraryWithActivities {
  id: string;
  tripId: string;
  day: number;
  date: Date;
  weatherNote: string | null;
  tips: string[];
  activities: ActivityWithLocation[];
}

export interface TripWithDetails extends Omit<Trip, 'itineraries'> {
  preferences: TripPreference | null;
  budget: Budget | null;
  recommendations: TripRecommendation[];
  itineraries: ItineraryWithActivities[];
}
