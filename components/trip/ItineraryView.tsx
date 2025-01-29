import { format, addDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Coffee, Sun, Sunset } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { TimeSlot } from '@prisma/client';
import { JSX } from 'react';
import { ActivityWithLocation, ItineraryWithActivities } from '@/types/trip';
import { ActivityCard } from '../activity/ActivityCard';

const timeSlots: TimeSlot[] = ['MORNING', 'AFTERNOON', 'EVENING'];

const timeSlotIcons: Record<TimeSlot, JSX.Element> = {
  MORNING: <Coffee className="w-4 h-4" />,
  AFTERNOON: <Sun className="w-4 h-4" />,
  EVENING: <Sunset className="w-4 h-4" />,
};

interface ItineraryViewProps {
  itinerary: ItineraryWithActivities[];
  onPlaceSelect?: (place: {
    location: { lat: number; lng: number };
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
  const getProgress = (activities: ActivityWithLocation[]) => {
    const completed = activities.filter((a) => a.status === 'COMPLETED').length;
    return (completed / activities.length) * 100;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Daily Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-4">
          {itinerary.slice(0, 5).map((day, index) => (
            <AccordionItem
              key={day.id || index}
              value={day.id || index.toString()}
              className="border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <h3 className="font-medium">Day {day.day}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(addDays(new Date(day.date), 1), 'EEEE, MMM dd')}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={getProgress(day.activities)}
                    className="w-24"
                  />
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <AnimatePresence>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4 space-y-6"
                  >
                    {timeSlots.map((slot) => {
                      const activities = day.activities.filter(
                        (a) => a.timeSlot === slot,
                      );
                      if (activities.length === 0) return null;

                      return (
                        <motion.div
                          key={slot}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-3"
                        >
                          <div className="flex items-center gap-2 text-primary">
                            {timeSlotIcons[slot]}
                            <h4 className="font-medium">
                              {slot.charAt(0) + slot.slice(1).toLowerCase()}
                            </h4>
                          </div>

                          <div className="space-y-3 pl-6">
                            {activities.map((activity, idx) => (
                              <motion.div
                                key={activity.id || idx}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                <ActivityCard
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
                                  onStatusChange={(id, status) =>
                                    onActivityUpdate?.(id, { status })
                                  }
                                  onRating={(id, rating) =>
                                    onActivityUpdate?.(id, { rating })
                                  }
                                  onAttachment={(id, file) =>
                                    console.log(id, file)
                                  }
                                />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}

                    {day.tips && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-muted/50 rounded-lg p-4 mt-4"
                      >
                        <h4 className="font-medium mb-2">Daily Tips</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {day.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
