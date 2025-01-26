'use client';

import { JSX, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createTrip, generateTripSuggestions } from '@/actions/trip';
import { generateTripSuggestion } from '@/actions/ai';
import { motion } from 'framer-motion';
import {
  FaSpinner,
  FaCheck,
  FaPlane,
  FaRobot,
  FaMapMarkedAlt,
} from 'react-icons/fa';
import { toast } from 'sonner';
import { z } from 'zod';
import { TripPreferenceSchema } from '@/schemas/trip';
import FullPageErrorView from '@/components/error/full-page-error-view';

type Step = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

const steps: Step[] = [
  {
    id: 1,
    title: 'Creating Your Trip',
    description: 'Setting up your travel preferences',
    icon: <FaPlane className="w-6 h-6" />,
  },
  {
    id: 2,
    title: 'Generating AI Suggestions',
    description: 'Our AI is crafting personalized recommendations',
    icon: <FaRobot className="w-6 h-6" />,
  },
  {
    id: 3,
    title: 'Preparing Your Journey',
    description: 'Getting everything ready for your adventure',
    icon: <FaMapMarkedAlt className="w-6 h-6" />,
  },
];

export default function ConfirmationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function processBooking() {
      try {
        // Step 1: Create Trip
        setCurrentStep(1);
        const tripData: z.infer<typeof TripPreferenceSchema> = {
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
            destination: searchParams.get('destination') || '',
          },
        };

        const tripResult = await createTrip(tripData);
        if (tripResult.error || !tripResult.data?.id)
          throw new Error(tripResult.error);

        // Step 2: Generate AI Suggestions
        setCurrentStep(2);
        const aiResult = await generateTripSuggestions(
          tripResult.data?.id,
          tripData,
        );
        if (aiResult.error) throw new Error(aiResult.error);

        // Step 3: Prepare Redirect
        setCurrentStep(3);
        toast.success('Trip created successfully!');

        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push(`/trip/${tripResult.data?.id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong');
      }
    }

    processBooking();
  }, []);

  if (error) {
    <FullPageErrorView message={error} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8">
        <div className="space-y-8">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className={`flex items-center gap-4 ${
                step.id < currentStep
                  ? 'text-green-500'
                  : step.id === currentStep
                    ? 'text-sky-500'
                    : 'text-slate-300'
              }`}
              animate={{
                opacity: step.id <= currentStep ? 1 : 0.5,
                y: 0,
              }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex-shrink-0">
                {step.id < currentStep ? (
                  <FaCheck className="w-6 h-6" />
                ) : step.id === currentStep ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <FaSpinner className="w-6 h-6" />
                  </motion.div>
                ) : (
                  step.icon
                )}
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
