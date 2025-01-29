import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ActivityCard } from '../activity/ActivityCard';
import { Progress } from '../ui/progress';
import { TimeSlot } from '@prisma/client';
import { useState } from 'react';
import {
  ActivityWithLocation,
  ItineraryWithActivities,
  Location,
} from '@/types/trip';

interface ItineraryViewProps {
  itinerary: ItineraryWithActivities[];
  onPlaceSelect?: (place: {
    location: Location;
    details: ActivityWithLocation;
  }) => void;
  onActivityUpdate?: (
    activityId: string,
    updates: Partial<ActivityWithLocation>,
  ) => Promise<void>;
}

export function ItineraryView({
  itinerary,
  onPlaceSelect,
  onActivityUpdate,
}: ItineraryViewProps) {
  const [activeDay, setActiveDay] = useState(0);

  const getProgress = (activities: ActivityWithLocation[]) => {
    const completed = activities.filter((a) => a.status === 'COMPLETED').length;
    return (completed / activities.length) * 100;
  };

  const timeSlots: TimeSlot[] = ['MORNING', 'AFTERNOON', 'EVENING'];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Itinerary</span>
          <Progress
            value={getProgress(itinerary[activeDay]?.activities || [])}
            className="w-32"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {itinerary.slice(0, 5).map((day, index) => (
            <div
              key={index}
              className={`space-y-6 ${index === activeDay ? 'border-l-2 border-primary' : ''}`}
            >
              <button
                onClick={() => setActiveDay(index)}
                className="flex items-center justify-between w-full p-4 hover:bg-muted/50 rounded-lg"
              >
                <h3 className="text-lg font-semibold">
                  Day {day.day} - {format(day.date, 'EEEE, MMM dd')}
                  {index === itinerary.length - 1 && (
                    <span className="text-sm text-muted-foreground ml-2">
                      (Last Day)
                    </span>
                  )}
                </h3>
                {day.weatherNote && (
                  <Badge variant="outline">{day.weatherNote}</Badge>
                )}
              </button>

              {index === activeDay && (
                <div className="space-y-6">
                  {timeSlots.map((slot) => {
                    const activities = day.activities.filter(
                      (a) => a.timeSlot === slot,
                    );
                    if (activities.length === 0) return null;

                    return (
                      <div key={slot} className="pl-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">
                          {slot}
                        </h4>
                        <div className="space-y-3">
                          {activities.map((activity, idx) => (
                            <ActivityCard
                              key={idx}
                              activity={activity}
                              onSelect={() =>
                                onPlaceSelect?.({
                                  location: {
                                    lat: activity.lat || 0,
                                    lng: activity.lng || 0,
                                  },
                                  details: activity,
                                })
                              }
                              onStatusChange={async (id, status) => {
                                await onActivityUpdate?.(id, { status });
                              }}
                              onRating={async (id, rating) => {
                                await onActivityUpdate?.(id, { rating });
                              }}
                              onAttachment={async (id, file) => {
                                // Handle file upload
                                console.log(id, file);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {day.tips && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Daily Tips</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {day.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
