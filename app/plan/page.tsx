'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

const popularDestinations = [
  { name: 'Paris', image: '/Images/place_image/paris.png' },
  { name: 'Tokyo', image: '/Images/place_image/tokyo.png' },
  { name: 'Rome', image: '/Images/place_image/rome.png' },
  { name: 'Bali', image: '/Images/place_image/bali.png' },
];

export default function PlanPage() {
  const [destination, setDestination] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      router.push(`/booking/${encodeURIComponent(destination.toLowerCase())}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Where do you want to go?
      </h1>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
        <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg">
          <Input
            type="text"
            placeholder="Enter your destination"
            className="flex-grow px-6 py-4 text-lg text-gray-700 focus:outline-none"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <Button
            type="submit"
            size="lg"
            className="bg-teal-500 text-white px-8 py-4 hover:bg-teal-600 transition-colors"
          >
            <Search className="h-6 w-6" />
          </Button>
        </div>
      </form>

      <h2 className="text-2xl font-semibold text-center mb-6">
        Popular Destinations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {popularDestinations.map((destination) => (
          <Link
            key={destination.name}
            href={`/booking/${destination.name.toLowerCase()}`}
            className="group"
          >
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
              <Image
                src={destination.image || '/placeholder.svg'}
                alt={destination.name}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-2xl font-semibold">
                  {destination.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
