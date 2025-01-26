import { Badge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { format } from 'date-fns';

interface ItineraryViewProps {
  itinerary: any[];
  onPlaceSelect?: (place: any) => void;
}

export function ItineraryView({
  itinerary,
  onPlaceSelect,
}: ItineraryViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {itinerary.map((day, index) => (
            <div key={index} className="border-l-2 border-primary pl-4">
              <h3 className="text-lg font-semibold mb-4">
                Day {day.day} - {format(new Date(day.date), 'EEEE, MMM dd')}
              </h3>
              <div className="space-y-4">
                {day.activities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onPlaceSelect?.(activity)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      <Badge>
                        {format(new Date(activity.startTime), 'HH:mm')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
