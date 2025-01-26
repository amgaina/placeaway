import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane } from 'lucide-react';
import { AITripSuggestion } from '@/schemas/trip';

export function TravelOverview({ data }: { data: AITripSuggestion }) {
  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="p-4 bg-sky-100">
        <CardTitle className="text-2xl flex items-center gap-2 text-sky-700">
          <Plane className="h-6 w-6" />
          Travel Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2 text-lg">
          <p>
            <span className="font-semibold">Destination:</span>{' '}
            {data.destination}
          </p>
          <p>
            <span className="font-semibold">Activities:</span>{' '}
            {data.activities.length}
          </p>
          <p>
            <span className="font-semibold">Duration:</span>{' '}
            {data.itinerary.length} days
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
