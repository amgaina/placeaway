import { Badge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { format } from 'date-fns';
import { Activity, Itinerary } from '@prisma/client';
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getLatLangFromAddress } from '@/actions/trip';
import { toast } from 'sonner';

interface Location {
  lat: number;
  lng: number;
}

interface IttineraryWithLocationAndActivity extends Itinerary {
  activities: ActivityWithLocation[];
}

interface ActivityWithLocation extends Activity {
  coordinates?: Location;
}

interface ItineraryViewProps {
  itinerary: IttineraryWithLocationAndActivity[];
  onPlaceSelect?: (place: {
    location: Location;
    details: ActivityWithLocation;
  }) => void;
}

export function ItineraryView({
  itinerary,
  onPlaceSelect,
}: ItineraryViewProps) {
  const [activities, setActivities] = useState<ActivityWithLocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  const getCoordinates = async (location: string) => {
    try {
      const response = await getLatLangFromAddress(location);

      if (response.error) {
        toast.error(response.error);
      } else if (response.data) {
        return {
          lat: response.data.lat,
          lng: response.data.lng,
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    return null;
  };

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
                {day.activities.map((activity: Activity, idx: number) => {
                  const activityWithLocation = activities.find(
                    (a) => a.id === activity.id,
                  );

                  return (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        if (!activity.location) return;

                        if (activity.lat && activity.lng) {
                          onPlaceSelect?.({
                            location: { lat: activity.lat, lng: activity.lng },
                            details: activity,
                          });
                          return;
                        }

                        getCoordinates(activity.location).then(
                          (coordinates) => {
                            if (coordinates) {
                              onPlaceSelect?.({
                                location: coordinates,
                                details: { ...activity, coordinates },
                              });
                            }
                          },
                        );
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {activity.title}
                            {isLoadingLocations ? (
                              <Skeleton className="h-4 w-4 rounded-full" />
                            ) : activity.location ? (
                              <MapPin className="w-4 h-4 text-primary" />
                            ) : null}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.location}
                          </p>
                        </div>
                        <Badge>
                          {format(
                            new Date(activity.startTime ?? Date.now()),
                            'HH:mm',
                          )}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
