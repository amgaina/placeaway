'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { ActivityWithLocation } from '@/types/activity';
import { ImageGallery } from './ImageGallery';
import { ReviewsList } from './ReviewsList';
import { FileUpload } from './FileUpload';
import { ActivityStatus } from '@prisma/client';
import { ActivityDetails } from './ActivityDetails';
import { getPlaceDetails } from '@/actions/places';
import LoadingIndicator from '../loading/loading-indicator';
import { PlaceDetails } from '@/services/GoogleMapsService';
import { toast } from 'sonner';

interface ActivityCardProps {
  activity: ActivityWithLocation;
  onSelect?: () => void;
  onStatusChange: (id: string, status: ActivityStatus) => Promise<void>;
  onRating: (id: string, rating: number) => Promise<void>;
  onAttachment: (id: string, file: File) => Promise<void>;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onSelect,
  onStatusChange,
  onRating,
  onAttachment,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaceLoading, setIsPlaceLoading] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (!activity.location) return;

      setIsPlaceLoading(true);
      setError(null);

      try {
        const result = await getPlaceDetails(activity.location);
        if (!result.success) {
          throw new Error(result.error);
        }
        if (!result.data) {
          throw new Error('No place details found');
        }

        toast.success('Place details loaded');

        setPlaceDetails(result.data);
      } catch (err) {
        toast.error('Failed to load place details');
        setError('Failed to load place details');
        console.error(err);
      } finally {
        setIsPlaceLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [activity.location]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <LoadingIndicator />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card onClick={onSelect} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-4">
        <ActivityDetails
          activity={activity}
          onRating={onRating}
          onStatusChange={onStatusChange}
        />

        {isPlaceLoading && (
          <div className="flex justify-center p-4">
            <LoadingIndicator />
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}

        {placeDetails?.photos && <ImageGallery images={placeDetails.photos} />}

        {placeDetails?.reviews && (
          <ReviewsList
            reviews={placeDetails.reviews}
            rating={placeDetails.rating}
            total={placeDetails.userRatingsTotal}
          />
        )}

        <FileUpload
          onUpload={async (files) => {
            setIsLoading(true);
            try {
              await onAttachment(activity.id, files[0]);
            } finally {
              setIsLoading(false);
            }
          }}
          activity={{
            ...activity,
            attachments: activity.attachments.map((attachment) => ({
              ...attachment,
              activityId: activity.id,
            })),
          }}
        />
      </CardContent>
    </Card>
  );
};
