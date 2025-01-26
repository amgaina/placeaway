'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createTrip } from '@/actions/trip';
import { generateTripSuggestion } from '@/actions/ai';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';

export default function ConfirmationPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log(searchParams);

  useEffect(() => {
    async function processBooking() {
      try {
        // Create initial trip
        const tripData = {
          title: searchParams.get('destination') || 'New Trip',
          startDate: searchParams.get('startDate')
            ? new Date(searchParams.get('startDate')!)
            : undefined,
          endDate: searchParams.get('endDate')
            ? new Date(searchParams.get('endDate')!)
            : undefined,
          preferences: {
            visitorCount: parseInt(searchParams.get('visitors') || '1'),
            hasPets: searchParams.get('hasPets') === 'true',
            hasChildren: searchParams.get('hasChildren') === 'true',
            interests: searchParams.get('interests')?.split(',') || [],
          },
        };

        const tripResult = await createTrip(tripData);
        if (tripResult.error) throw new Error(tripResult.error);

        // Generate AI suggestions
        const aiResult = await generateTripSuggestion(tripData);
        if (aiResult.error) throw new Error(aiResult.error);
        toast.success('Trip created successfully!');
        // Redirect to trip page
        toast.promise(
          new Promise((resolve) => {
            router.push(`/trip/${tripResult.data?.id}`);
            resolve(true);
          }),
          {
            loading: 'Redirecting...',
            success: 'Redirecting to trip page',
            error: 'Failed to redirect',
          },
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    processBooking();
  }, []);

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return null;
}

function LoadingView() {
  return (
    <div className="flex items-center justify-center h-screen text-2xl">
      <FaSpinner />
    </div>
  );
}

function ErrorView({ error }: { error: string }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-red-500">{error}</p>
    </div>
  );
}
