'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserTrips } from '@/actions/trip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaPlane, FaSpinner } from 'react-icons/fa';
import { formatDate } from '@/lib/utils';

type Trip = {
  id: string;
  title: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  preferences: {
    destination: string;
    visitorCount: number;
  };
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadTrips() {
      const result = await getUserTrips();
      if (result.error) {
        setError(result.error);
      } else {
        // Transform the data to include preferences
        const transformedTrips = (result.data || []).map((trip) => ({
          ...trip,
          preferences: {
            destination: trip.title || '',
            visitorCount: 1,
          },
        }));
        setTrips(transformedTrips);
      }
      setLoading(false);
    }

    loadTrips();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="w-8 h-8 text-primary animate-spin" />
          <p className="text-primary font-medium">Loading your trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">Your Trips</h1>
          <p className="text-muted-foreground">
            Manage and explore your travel plans
          </p>
        </header>

        {trips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No trips planned yet</p>
            <Button
              onClick={() => router.push('/booking')}
              className="bg-primary hover:bg-primary/90"
            >
              Plan Your First Trip
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card
                key={trip.id}
                className="group cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/trip/${trip.id}`)}
              >
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2">
                    <FaPlane className="text-primary" />
                    <span className="text-primary">
                      {trip.preferences.destination}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {trip.preferences.visitorCount} Visitor
                      {trip.preferences.visitorCount > 1 ? 's' : ''}
                    </p>
                    {trip.startDate && (
                      <p className="text-sm text-muted-foreground">
                        {formatDate(trip.startDate)} -{' '}
                        {formatDate(trip.endDate!)}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {trip.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
