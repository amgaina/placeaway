import { Badge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { format } from 'date-fns';
import { Activity } from '@prisma/client';
import { useLoadScript } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface Location {
  lat: number;
  lng: number;
}

interface ActivityWithLocation extends Activity {
  coordinates?: Location;
}

interface ItineraryViewProps {
  itinerary: any[];
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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  useEffect(() => {
    async function getCoordinates() {
      if (!isLoaded) return;

      const geocoder = new google.maps.Geocoder();
      const activitiesWithCoordinates = await Promise.all(
        itinerary.flatMap((day) =>
          day.activities.map(async (activity: Activity) => {
            try {
              const result = await geocoder.geocode({
                address: activity.location,
              });

              const coordinates = result.results[0]?.geometry.location
                ? {
                    lat: result.results[0].geometry.location.lat(),
                    lng: result.results[0].geometry.location.lng(),
                  }
                : undefined;

              return { ...activity, coordinates };
            } catch (error) {
              console.error(`Failed to geocode ${activity.location}:`, error);
              return activity;
            }
          }),
        ),
      );

      setActivities(activitiesWithCoordinates);
      setIsLoadingLocations(false);
    }

    getCoordinates();
  }, [itinerary, isLoaded]);

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
                      onClick={() =>
                        activityWithLocation?.coordinates &&
                        onPlaceSelect?.({
                          location: activityWithLocation.coordinates,
                          details: activityWithLocation,
                        })
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {activity.title}
                            {isLoadingLocations ? (
                              <Skeleton className="h-4 w-4 rounded-full" />
                            ) : activityWithLocation?.coordinates ? (
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
