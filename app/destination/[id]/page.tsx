import Image from 'next/image';
import {
  MapPin,
  ArrowRight,
  Calendar,
  DollarSign,
  Compass,
  Book,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import ExpandableDescription from '@/components/expandabledescription';

interface PageProps {
  params: {
    id: string;
  };
}

const destinations = {
  bali: {
    name: 'Bali, Indonesia',
    image: '/Images/place_image/bali.png',
    description:
      'Bali, the famed Island of the Gods, with its varied landscape of hills and mountains, rugged coastlines and sandy beaches, lush rice terraces and barren volcanic hillsides all providing a picturesque backdrop to its colorful, deeply spiritual and unique culture, stakes a serious claim to be paradise on earth.',
    estimatedCost: '$1,500 - $3,000',
  },
  santorini: {
    name: 'Santorini, Greece',
    image: '/Images/place_image/santorini.png',
    description:
      'Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The whitewashed, cubiform houses of its 2 principal towns, Fira and Oia, cling to cliffs above an underwater caldera (crater).',
    estimatedCost: '$2,000 - $4,000',
  },
  'machu-picchu': {
    name: 'Machu Picchu, Peru',
    image: '/Images/place_image/machu_picchu.png',
    description:
      "Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley. Built in the 15th century and later abandoned, it's renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar, intriguing buildings that play on astronomical alignments and panoramic views.",
    estimatedCost: '$1,800 - $3,500',
  },
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const destination = destinations[id as keyof typeof destinations];

  if (!destination) {
    return <div>Destination not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-1 p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {destination.name}
              </h1>
              <div className="mb-8 flex items-center">
                <div className="flex-1 flex items-center">
                  <MapPin className="text-red-500 mr-2" />
                  <span className="font-semibold">Monroe, LA</span>
                </div>
                <ArrowRight className="text-gray-400 mx-4" />
                <div className="flex-1 flex items-center">
                  <MapPin className="text-green-500 mr-2" />
                  <span className="font-semibold">{destination.name}</span>
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="mr-2 text-blue-500" />
                  Estimated Cost
                </h2>
                <p className="text-xl text-gray-700">
                  {destination.estimatedCost}
                </p>
              </div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <ExpandableDescription description={destination.description} />
              </div>
            </div>
            <div className="md:flex-1">
              <div className="h-64 md:h-full relative">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Plan based on your preference
          </h2>
          <p className="text-xl mb-6">
            Design your ideal trip by selecting your budget, accommodation
            style, travel dates, and activities.
          </p>
          <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full text-lg hover:bg-blue-50 transition duration-300">
            Plan My Trip
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Virtual Tour or AR View"
            description="Experience the destination before you arrive with our immersive virtual tour."
            imageSrc="/Images/place_features/virtual_tour.png"
            icon={<Compass className="w-6 h-6" />}
          />
          <FeatureCard
            title="Things To Do"
            description="Discover the best activities and attractions at your destination."
            imageSrc="/Images/place_features/things_to_do.png"
            icon={<Compass className="w-6 h-6" />}
          />
          <FeatureCard
            title="When To Visit"
            description="Find out the best time to visit based on weather, crowds, and special events."
            imageSrc="/Images/place_features/when_to_visit.png"
            icon={<Calendar className="w-6 h-6" />}
          />
          <FeatureCard
            title="Local Recommendations"
            description="Get insider tips and recommendations from locals who know the destination best."
            imageSrc="/Images/place_features/recommendations.png"
            icon={<MapPin className="w-6 h-6" />}
          />
          <FeatureCard
            title="Travel Diary"
            description="Read personal experiences and stories from fellow travelers."
            imageSrc="/Images/place_features/travel_diary.png"
            icon={<Book className="w-6 h-6" />}
          />
          <FeatureCard
            title="Reviews and Ratings"
            description="See what other travelers are saying about accommodations, restaurants, and attractions."
            imageSrc="/Images/place_features/reviews_ratings.png"
            icon={<Star className="w-6 h-6" />}
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  imageSrc,
  icon,
}: {
  title: string;
  description: string;
  imageSrc: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href="#" className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition duration-300 hover:shadow-lg hover:scale-105">
        <div className="h-48 relative">
          <Image src={imageSrc} alt={title} layout="fill" objectFit="cover" />
        </div>
        <div className="p-6">
          <div className="flex items-center mb-2">
            <div className="mr-2 text-blue-500">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}
