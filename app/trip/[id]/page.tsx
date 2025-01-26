'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TripService } from '@/services/TripService';
import { AITripSuggestion } from '@/schemas/trip';
import { transformTripData } from '@/lib/transforms/tripTransform';
import { TravelOverview } from '@/components/trip/TravelOverview';
import { BudgetTracker } from '@/components/trip/BudgetTracker';
import { ItineraryView } from '@/components/trip/ItineraryView';
import { ChatInterface } from '@/components/trip/ChatInterface';
import { RecommendationsList } from '@/components/trip/RecommendationsList';

export default function TripPage() {
  const [tripData, setTripData] = useState<AITripSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    async function loadTripData() {
      try {
        const result = await TripService.getTripWithDetails(
          params.id as string,
        );
        if (result) {
          const transformedData = transformTripData(result);
          setTripData(transformedData);
        }
      } catch (err) {
        setError('Failed to load trip data');
      }
    }

    loadTripData();
  }, [params.id]);

  if (error) {
    return <ErrorView message={error} />;
  }

  if (!tripData) {
    return <LoadingView />;
  }

  return (
    <div className="bg-slate-100 text-slate-800 p-6 min-h-screen">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-sky-700">
          Your {tripData.destination} Adventure
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TravelOverview data={tripData} />
        <BudgetTracker budget={tripData.budget} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ItineraryView itinerary={tripData.itinerary} />
        <RecommendationsList recommendations={tripData.recommendations} />
      </div>

      <ChatInterface tripId={params.id as string} />
    </div>
  );
}

function LoadingView() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-500">{message}</p>
    </div>
  );
}
