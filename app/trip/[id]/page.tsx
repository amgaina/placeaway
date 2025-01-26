'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AITripSuggestion } from '@/schemas/trip';
import { transformTripData } from '@/lib/transforms/tripTransform';
import { TravelOverview } from '@/components/trip/TravelOverview';
import { BudgetTracker } from '@/components/trip/BudgetTracker';
import { ItineraryView } from '@/components/trip/ItineraryView';
import { ChatInterface } from '@/components/trip/ChatInterface';
import { RecommendationsList } from '@/components/trip/RecommendationsList';
import { FaDatabase, FaRobot, FaMapMarkedAlt } from 'react-icons/fa';
import { LoadingSteps } from '@/components/loading/LoadingSteps';
import { getTripWithDetails } from '@/actions/trip';

const loadingSteps = [
  {
    id: 1,
    title: 'Loading Trip Data',
    description: 'Fetching your travel information',
    icon: <FaDatabase className="w-6 h-6" />,
  },
  {
    id: 2,
    title: 'Generating AI Suggestions',
    description: 'Creating personalized recommendations',
    icon: <FaRobot className="w-6 h-6" />,
  },
  {
    id: 3,
    title: 'Preparing Interface',
    description: 'Setting up your travel dashboard',
    icon: <FaMapMarkedAlt className="w-6 h-6" />,
  },
];

export default function TripPage() {
  const [tripData, setTripData] = useState<AITripSuggestion | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const [loadingStep, setLoadingStep] = useState(1);

  useEffect(() => {
    async function loadTripData() {
      try {
        setLoadingStep(1);
        const result = await getTripWithDetails(params.id as string);

        if (result && 'data' in result && result.data) {
          setLoadingStep(2);
          setIsGeneratingAI(true);
          const transformedData = transformTripData(result.data);
          setTripData(transformedData);
          setLoadingStep(3);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (err) {
        setError('Failed to load trip data');
      } finally {
        setIsGeneratingAI(false);
      }
    }

    loadTripData();
  }, [params.id]);

  if (error) {
    return <ErrorView message={error} />;
  }

  if (!tripData || isGeneratingAI) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSteps steps={loadingSteps} currentStep={loadingStep} />
      </div>
    );
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

function LoadingView({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-sky-700 font-medium">{message}</p>
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
