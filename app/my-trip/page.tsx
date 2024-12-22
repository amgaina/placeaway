import Image from 'next/image'
import { Calendar, MapPin, Plane, Hotel, Car, CreditCard, Download } from 'lucide-react'
import Layout from '../components/layout'

export default function MyTrip() {
  return (
    <Layout>
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">My Trip</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-sky-500 mr-2" />
                <h2 className="text-2xl font-semibold">Paris, France</h2>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>June 15 - June 22, 2023</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Plane className="h-5 w-5 text-sky-500 mr-2" />
                  <h3 className="font-semibold">Flight</h3>
                </div>
                <p className="text-sm text-gray-600">Air France AF1234</p>
                <p className="text-sm text-gray-600">Departure: JFK 10:00 AM</p>
                <p className="text-sm text-gray-600">Arrival: CDG 11:30 PM</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Hotel className="h-5 w-5 text-sky-500 mr-2" />
                  <h3 className="font-semibold">Hotel</h3>
                </div>
                <p className="text-sm text-gray-600">Le Grand Paris</p>
                <p className="text-sm text-gray-600">Check-in: June 15, 3:00 PM</p>
                <p className="text-sm text-gray-600">Check-out: June 22, 11:00 AM</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Car className="h-5 w-5 text-sky-500 mr-2" />
                  <h3 className="font-semibold">Car Rental</h3>
                </div>
                <p className="text-sm text-gray-600">Renault Clio</p>
                <p className="text-sm text-gray-600">Pick-up: CDG Airport</p>
                <p className="text-sm text-gray-600">Drop-off: CDG Airport</p>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Itinerary</h3>
              <div className="space-y-4">
                {[
                  { day: 'Day 1', activities: ['Arrive in Paris', 'Check-in to hotel', 'Evening walk along Seine River'] },
                  { day: 'Day 2', activities: ['Visit Eiffel Tower', 'Lunch at local café', 'Explore Louvre Museum'] },
                  { day: 'Day 3', activities: ['Day trip to Versailles', 'Wine tasting experience'] },
                ].map((day) => (
                  <div key={day.day} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">{day.day}</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {day.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold mb-2">Total Cost</h3>
                <div className="flex items-center text-2xl font-bold text-sky-500">
                  <CreditCard className="h-6 w-6 mr-2" />
                  $2,500
                </div>
              </div>
              <button className="flex items-center bg-sky-500 text-white px-6 py-2 rounded-md hover:bg-sky-600 transition-colors">
                <Download className="h-5 w-5 mr-2" />
                Download Itinerary
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Trip Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Eiffel Tower', image: '/placeholder.svg?height=300&width=400' },
              { name: 'Louvre Museum', image: '/placeholder.svg?height=300&width=400' },
              { name: 'Notre-Dame Cathedral', image: '/placeholder.svg?height=300&width=400' },
            ].map((highlight) => (
              <div key={highlight.name} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={highlight.image}
                    alt={highlight.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{highlight.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-sky-500 to-amber-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Enjoy Your Trip!</h2>
          <p className="text-xl mb-8">Don&apos;t forget to share your experiences and photos with us when you return.</p>
          <button className="bg-white text-sky-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Share Your Story
          </button>
        </div>
      </section>
    </Layout>
  )
}

