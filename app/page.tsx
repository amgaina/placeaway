import Image from 'next/image'
import Link from 'next/link'
import { Search, Globe, Map, Calendar, CreditCard, Compass, Sliders, Plane, Car, Building, Briefcase } from 'lucide-react'
import Layout from './components/layout'

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AbstractLines, AbstractShapes } from '@/components/decorative-elements'
import SubscriptionPlans from '@/components/subscription-plans'
import BookingPolicy from '@/components/booking-policy'

export default function Home() {
  return (
    <Layout>
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Beautiful tropical beach"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" />
        <AbstractLines className="text-white opacity-10 top-0 left-0" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Your Journey, Your Way</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Experience unparalleled flexibility with TripZens AI-powered travel planning and customizable packages.</p>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg">
              <Input
                type="text"
                placeholder="Where do you want to go?"
                className="flex-grow px-6 py-4 text-gray-700 focus:outline-none"
              />
              <button className="bg-teal-500 text-white px-6 py-4 hover:bg-teal-600 transition-colors">
                <Search className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-gray-100 overflow-hidden">
        <AbstractShapes className="text-teal-200 opacity-30 top-0 right-0" />
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Trending Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Bali, Indonesia', image: '/placeholder.svg?height=400&width=600', description: 'Island paradise' },
              { name: 'Santorini, Greece', image: '/placeholder.svg?height=400&width=600', description: 'Breathtaking sunsets' },
              { name: 'Machu Picchu, Peru', image: '/placeholder.svg?height=400&width=600', description: 'Ancient wonders' },
            ].map((destination) => (
              <Link key={destination.name} href={`/explore/${destination.name.toLowerCase().replace(', ', '-')}`} className="group">
                <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white text-2xl font-semibold">{destination.name}</h3>
                    <p className="text-white text-sm mt-1">{destination.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden">
        <AbstractLines className="text-blue-100 opacity-20 bottom-0 right-0" />
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Why TripZen is Your Ultimate Travel Companion</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-teal-100 rounded-full p-6 inline-block mb-4">
                <Globe className="h-12 w-12 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">AI-Powered Recommendations</h3>
              <p className="text-gray-600">Our advanced AI analyzes your preferences and travel history to suggest perfect destinations and activities.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 inline-block mb-4">
                <Map className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Interactive Trip Planning</h3>
              <p className="text-gray-600">Create and customize your itinerary with our intuitive drag-and-drop interface and real-time collaboration tools.</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 rounded-full p-6 inline-block mb-4">
                <CreditCard className="h-12 w-12 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Smart Budgeting</h3>
              <p className="text-gray-600">Stay on top of your expenses with our intelligent budget tracker and find the best deals for your trip.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-gradient-to-r from-blue-500 to-teal-500 text-white overflow-hidden">
        <AbstractShapes className="text-white opacity-10 top-0 left-0" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Customize Your Perfect Trip</h2>
              <p className="text-xl mb-6">TripZen&apos;s flexible packages let you tailor every aspect of your journey. Choose your preferred services and build your dream vacation on-the-go.</p>
              <Link href="/customize" className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block">
                Start Customizing
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg p-6 shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Custom Package</h3>
                <div className="space-y-4">
                  {[
                    { icon: Plane, title: 'Flights', options: ['Standard Airlines', 'Budget Airlines', 'Private Jet'] },
                    { icon: Building, title: 'Accommodation', options: ['Hotels', 'Airbnb', 'Hostels', 'Resorts'] },
                    { icon: Car, title: 'Transportation', options: ['Uber', 'Lyft', 'Public Transit', 'Car Rental'] },
                    { icon: Briefcase, title: 'Activities', options: ['Guided Tours', 'Self-Guided Exploration', 'Adventure Sports'] },
                  ].map((category, index) => (
                    <div key={index} className="flex items-center">
                      <category.icon className="h-6 w-6 text-turquoise-500 mr-3" />
                      <div>
                        <h4 className="font-semibold text-gray-800">{category.title}</h4>
                        <p className="text-sm text-gray-600">{category.options.join(' • ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden">
        <AbstractLines className="text-blue-100 opacity-20 top-0 right-0" />
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Exclusive TripZen Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Compass, title: 'Local Experiences', description: 'Discover hidden gems and authentic local experiences curated by our community of travelers.' },
              { icon: Calendar, title: 'Flexible Bookings', description: 'Enjoy peace of mind with our flexible booking options and free cancellation on select reservations.' },
              { icon: Globe, title: 'Language Support', description: 'Break language barriers with our built-in translation feature for smooth communication abroad.' },
              { icon: Sliders, title: 'AI Service Alternatives', description: 'Get smart recommendations for alternative services based on your preferences and budget.' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <feature.icon className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SubscriptionPlans />

      <section className="py-16 bg-gradient-to-r from-sky-500 to-amber-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Inspiration?</h2>
          <p className="text-xl mb-8">Check out our curated travel guides for popular destinations.</p>
          <button className="bg-white text-sky-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Explore Travel Guides
          </button>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Traveler Insights</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: 'Sarah L.', location: 'New York, USA', quote: 'TripZen\'s customizable packages allowed me to create my dream European adventure. The AI recommendations were spot-on!' },
              { name: 'Carlos M.', location: 'Barcelona, Spain', quote: 'As a frequent traveler, I love how TripZen lets me choose alternative services. It\'s perfect for my ever-changing travel style.' },
              { name: 'Yuki T.', location: 'Tokyo, Japan', quote: 'The budget tracking feature and AI-suggested alternatives helped me save money without compromising on experiences. Highly recommended!' },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">&quot;{testimonial.quote}&quot;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <BookingPolicy />

      <section className="py-12 bg-gradient-to-r from-sky-500 to-amber-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Let our AI-powered travel planner create your perfect itinerary.</p>
          <Link href="/plan" className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Plan Your Trip Now
          </Link>
        </div>
      </section>
    </Layout>
  )
}

