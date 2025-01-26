'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TripWithPreferencesAndBudgetAndTripRecommendation } from '@/schemas/trip';
import { TravelOverview } from '@/components/trip/TravelOverview';
import { BudgetTracker } from '@/components/trip/BudgetTracker';
import { ItineraryView } from '@/components/trip/ItineraryView';
import { ChatInterface } from '@/components/trip/ChatInterface';
import { RecommendationsList } from '@/components/trip/RecommendationsList';
import { FaDatabase, FaRobot, FaMapMarkedAlt } from 'react-icons/fa';
import { LoadingSteps } from '@/components/loading/LoadingSteps';
import { getTripWithDetails, updateTripPreferences } from '@/actions/trip';
import FullPageErrorView from '@/components/error/full-page-error-view';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PreferencesForm } from '@/components/trip/PreferencesForm';
import { TripHeader } from '@/components/trip/TripHeader';
import { TripActions } from '@/components/trip/TripActions';

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

const defaultCenter = { lat: 27.7172, lng: 85.324 }; // Default coordinates (example: Kathmandu)

export default function TripPage() {
  const [tripData, setTripData] =
    useState<TripWithPreferencesAndBudgetAndTripRecommendation | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const [loadingStep, setLoadingStep] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<{
    location: { lat: number; lng: number };
  } | null>(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function loadTripData() {
      try {
        setLoadingStep(1);
        const result = await getTripWithDetails(params.id as string);

        if (result && 'data' in result && result.data) {
          setLoadingStep(2);
          console.log(result.data);
          setIsGeneratingAI(true);
          // const transformedData = transformTripData(result.data);
          setTripData(result.data);
          setSelectedPlace({
            location: {
              lat:
                result.data.itineraries?.[0]?.activities?.[0]?.lat ??
                defaultCenter.lat,
              lng:
                result.data.itineraries?.[0]?.activities?.[0]?.lng ??
                defaultCenter.lng,
            },
          });
          setLoadingStep(3);
        } else {
          setError('Failed to load trip data');
        }
      } catch (err) {
        setError('Failed to load trip data');
      } finally {
        setIsGeneratingAI(false);
      }
    }

    loadTripData();
  }, [params.id]);

  const handleUpdate = async (values: any) => {
    setIsEditing(false);
    const result = await updateTripPreferences(params.id as string, values);
    if (result.data) {
      setTripData(result.data);
    }
  };

  if (error) {
    return <FullPageErrorView message={error} />;
  }

  if (!tripData || isGeneratingAI) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSteps steps={loadingSteps} currentStep={loadingStep} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TripHeader trip={tripData} onEdit={() => setIsEditing(true)} />

      <div className="max-w-7xl mx-auto p-6">
        {isEditing ? (
          <PreferencesForm
            defaultValues={tripData || undefined}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <TravelOverview data={tripData} />

                <Card>
                  <CardHeader>
                    <CardTitle>Trip Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={33} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Planning</span>
                        <span>In Progress</span>
                        <span>Completed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <ItineraryView
                  itinerary={tripData.itineraries}
                  onPlaceSelect={setSelectedPlace}
                />

                {tripData.budget && <BudgetTracker budget={tripData.budget} />}
              </div>

              {/* Map Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {isLoaded && (
                    <Card className="overflow-hidden">
                      <GoogleMap
                        zoom={13}
                        center={selectedPlace?.location || defaultCenter}
                        mapContainerClassName="w-full h-[400px]"
                      >
                        {tripData.itineraries.map((day) =>
                          day.activities.map((activity) => (
                            <Marker
                              key={activity.id}
                              position={
                                activity.lat && activity.lng
                                  ? { lat: activity.lat, lng: activity.lng }
                                  : defaultCenter
                              }
                              onClick={() =>
                                setSelectedPlace({
                                  location: {
                                    lat: activity?.lat ?? defaultCenter.lat,
                                    lng: activity?.lng ?? defaultCenter.lng,
                                  },
                                })
                              }
                            />
                          )),
                        )}
                      </GoogleMap>
                    </Card>
                  )}

                  <RecommendationsList
                    recommendations={tripData.recommendations ?? []}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <TripActions tripId={params.id as string} />
            </div>
          </>
        )}
      </div>

      {/* Floating Chat Interface */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed top-0 z-50 right-0 w-full md:w-[400px] h-full bg-white shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Trip Assistant</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ChatInterface tripId={params.id as string} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
