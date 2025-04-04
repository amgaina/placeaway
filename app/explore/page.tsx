import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Users,
  Compass,
  Camera,
  Utensils,
} from 'lucide-react';
import PersonalizedRecommendations from '@/components/personalized-recommendations';
import DestinationCard from '@/components/destination-card';
import UserGeneratedContent from '@/components/user-generated-content';
import InspiringVisuals from '@/components/inspiring-visuals';
import Search_bar from './search_bar';

const categories = [
  { name: 'Adventure', icon: Compass },
  { name: 'Cultural', icon: Camera },
  { name: 'Relaxation', icon: Users },
  { name: 'Culinary', icon: Utensils },
];

const featuredDestinations = [
  {
    id: 1,
    name: 'Bali',
    image: '/Images/place_image/bali.png',
    description: 'Island paradise',
    category: 'Relaxation',
    price: 1200,
    duration: 7,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Tokyo',
    image: '/Images/place_image/tokyo.png',
    description: 'Urban adventure',
    category: 'Cultural',
    price: 1800,
    duration: 5,
    rating: 4.9,
  },
  {
    id: 3,
    name: 'Machu Picchu',
    image: '/Images/place_image/machu_picchu.png',
    description: 'Ancient wonder',
    category: 'Adventure',
    price: 1500,
    duration: 6,
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Paris',
    image: '/Images/place_image/paris.png',
    description: 'City of lights',
    category: 'Culinary',
    price: 2000,
    duration: 6,
    rating: 4.6,
  },
  {
    id: 5,
    name: 'Great Barrier Reef',
    image: '/Images/place_image/great-barrier-reef.png',
    description: 'Underwater marvel',
    category: 'Adventure',
    price: 2200,
    duration: 8,
    rating: 4.8,
  },
  {
    id: 6,
    name: 'Rome',
    image: '/Images/place_image/rome.png',
    description: 'Eternal city',
    category: 'Cultural',
    price: 1700,
    duration: 5,
    rating: 4.7,
  },
];

export default function Explore() {
  const filteredDestinations = featuredDestinations;

  return (
    <>
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Explore Destinations
          </h1>
          <Search_bar />
          <div className="flex">
            <div className="flex-grow">
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Featured Categories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={`/explore/category/${category.name.toLowerCase()}`}
                      className="bg-white rounded-lg p-4 text-center hover:bg-turquoise-100 transition-colors"
                    >
                      <category.icon className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                    </Link>
                  ))}
                </div>
              </div>

              <PersonalizedRecommendations />

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Featured Destinations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredDestinations.map((destination) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                    />
                  ))}
                </div>
              </div>

              <UserGeneratedContent />

              <InspiringVisuals />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-turquoise-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Plan Your Next Adventure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <MapPin className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Choose Your Destination
              </h3>
              <p className="text-gray-600">
                Explore our curated list of destinations and find your perfect
                match.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Calendar className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Set Your Dates</h3>
              <p className="text-gray-600">
                Find the best time to visit and plan your itinerary accordingly.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Users className="h-12 w-12 text-turquoise-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Customize Your Experience
              </h3>
              <p className="text-gray-600">
                Tailor your trip to your preferences and travel style.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-orange-500 to-teal-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8">
            Let our AI-powered travel planner create your perfect itinerary.
          </p>
          <Link
            href="/plan"
            className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Plan Your Trip Now
          </Link>
        </div>
      </section>
    </>
  );
}
