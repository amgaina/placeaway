'use client';

import { useParams } from 'next/navigation';
import BookingSlider from './BookingSlider';
import { BookingProvider } from './BookingContext';
import Link from 'next/link';

export default function BookingPage() {
  const params = useParams();
  const place = params.place as string;

  return (
    <BookingProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-8 relative">
        <div className="absolute inset-0 bg-white opacity-10 z-0">
          <div className="w-full h-full bg-[url('/placeholder.svg?height=600&width=800')] bg-repeat opacity-50"></div>
        </div>
        <Link
          href="/"
          className="absolute top-4 right-4 text-4xl text-white hover:text-gray-200 z-10"
        >
          &times;
        </Link>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-center mb-12 text-white">
            Book Your Trip to {place.charAt(0).toUpperCase() + place.slice(1)}
          </h1>
          <div className="max-w-4xl mx-auto">
            <BookingSlider />
          </div>
          <div className="mt-8 text-center text-white">
            <p>&copy; 2025 Placeaway. All rights reserved.</p>
            <p className="mt-2">Trip powered by AI</p>
          </div>
        </div>
      </div>
    </BookingProvider>
  );
}
