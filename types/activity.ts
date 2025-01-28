import {
  Activity,
  Attachment,
  Itinerary,
  TimeSlot,
  ActivityType,
  ActivityStatus,
} from '@prisma/client';

export interface Location {
  lat: number;
  lng: number;
}

export interface AttachmentWithoutActivity
  extends Omit<Attachment, 'activity' | 'activityId'> {
  id: string;
  url: string;
  type: string;
  filename: string;
}

export interface ActivityWithLocation
  extends Omit<Activity, 'attachments' | 'itinerary'> {
  attachments: AttachmentWithoutActivity[];
  lat: number | null;
  lng: number | null;
  timeSlot: TimeSlot;
  type: ActivityType;
  status: ActivityStatus;
  rating: number;
}

export interface ItineraryWithActivities
  extends Omit<Itinerary, 'activities' | 'trip' | 'date'> {
  activities: ActivityWithLocation[];
  date: string;
  weatherNote: string | null;
  tips: string[];
}
