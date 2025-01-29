import { format } from 'date-fns';
import { ActivityWithLocation } from '@/types/activity';
import { Rating } from '../ui/Rating';
import { ActivityActions } from './ActivityActions';
import { ActivityStatus } from '@prisma/client';

interface ActivityDetailsProps {
  activity: ActivityWithLocation;
  onRating: (id: string, rating: number) => Promise<void>;
  onStatusChange: (id: string, status: ActivityStatus) => Promise<void>;
}

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  activity,
  onRating,
  onStatusChange,
}) => {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <h4 className="font-medium">{activity.title}</h4>
        <p className="text-sm text-muted-foreground">{activity.description}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            {activity.startTime
              ? format(new Date(activity.startTime), 'PPp')
              : 'No date set'}
          </span>
          <span>{activity.cost} USD</span>
        </div>
        <Rating
          value={activity.rating || 0}
          onChange={(rating) => onRating(activity.id, rating)}
        />
      </div>
      <ActivityActions
        status={activity.status}
        onStatusChange={(status) => onStatusChange(activity.id, status)}
        onAttachment={async (file: File) => {
          console.log(file);
        }}
      />
    </div>
  );
};
