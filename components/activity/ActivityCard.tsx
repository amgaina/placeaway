import { Upload, ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ActivityStatus, TimeSlot, ActivityType } from '@prisma/client';
import { ActivityWithLocation } from '@/types/activity';
import { Rating } from '../ui/Rating';
import { ActivityActions } from './ActivityActions';

interface ActivityCardProps {
  activity: ActivityWithLocation;
  onSelect?: () => void;
  onStatusChange: (id: string, status: ActivityStatus) => Promise<void>;
  onRating: (id: string, rating: number) => Promise<void>;
  onAttachment: (id: string, file: File) => Promise<void>;
}

export function ActivityCard({
  activity,
  onStatusChange,
  onRating,
  onAttachment,
  onSelect,
}: ActivityCardProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        await onAttachment(activity.id, file);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Card onClick={onSelect} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h4 className="font-medium">{activity.title}</h4>
            <p className="text-sm text-muted-foreground">
              {activity.description}
            </p>
            <Rating
              value={activity.rating || 0}
              onChange={(rating) => onRating(activity.id, rating)}
            />
          </div>
          <ActivityActions
            status={activity.status}
            onStatusChange={(status) => onStatusChange(activity.id, status)}
            onAttachment={(file) => onAttachment(activity.id, file)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
