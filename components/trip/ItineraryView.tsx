import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AITripSuggestion } from '@/schemas/trip';
import { Calendar } from 'lucide-react';

export function ItineraryView({
  itinerary,
}: {
  itinerary: AITripSuggestion['itinerary'];
}) {
  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="p-4 bg-sky-100">
        <CardTitle className="text-2xl flex items-center gap-2 text-sky-700">
          <Calendar className="h-6 w-6" />
          Trip Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="itinerary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-sky-50">
            <TabsTrigger value="itinerary">Daily Schedule</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>
          <TabsContent value="itinerary" className="p-4 space-y-3">
            {itinerary.map((day) => (
              <div key={day.day} className="space-y-2">
                <h3 className="font-semibold">Day {day.day}</h3>
                <ul className="list-disc list-inside">
                  {day.activities.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
