import { format } from 'date-fns';
import { Calendar, Edit2 } from 'lucide-react';
import { Button } from '../ui/button';

export function TripHeader({
  trip,
  onEdit,
}: {
  trip: any;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-6 bg-white border-b">
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {trip.preferences?.destination}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground mt-1">
          {trip.startDate && (
            <>
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(trip.startDate), 'MMM dd')} -
                {format(new Date(trip.endDate), 'MMM dd, yyyy')}
              </span>
            </>
          )}
        </div>
      </div>
      <Button onClick={onEdit} variant="outline">
        <Edit2 className="w-4 h-4 mr-2" />
        Edit Trip
      </Button>
    </div>
  );
}
