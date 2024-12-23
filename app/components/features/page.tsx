import Link from 'next/link';
import { Hotel, Package, CheckSquare, Map } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Hotel,
    title: 'Find Your Dream Stay',
    description:
      'Discover perfect accommodations tailored to your preferences.',
    href: '/stays',
  },
  {
    icon: Package,
    title: 'Cheap Holiday Packages',
    description: 'Unbeatable deals on complete vacation experiences.',
    href: '/packages',
  },
  {
    icon: CheckSquare,
    title: 'Effortless CheckIn',
    description: 'Streamlined process for a smooth start to your journey.',
    href: '/checkin',
  },
  {
    icon: Map,
    title: 'Explore Places',
    description: 'Uncover hidden gems and popular destinations worldwide.',
    href: '/explore',
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Discover TripZen Features
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href} className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="mx-auto rounded-full bg-blue-100 p-3 w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                    <feature.icon className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
