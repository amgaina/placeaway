import Image from 'next/image'
import Link from 'next/link'
import { DollarSign, Clock, Star } from 'lucide-react'

export default function DestinationCard({ destination }) {
  return (
    <Link href={`/explore/${destination.name.toLowerCase().replace(/\s+/g, '-')}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        <div className="relative h-48">
          <Image
            src={destination.image}
            alt={destination.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
            {destination.category}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
          <p className="text-gray-600 mb-2">{destination.description}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>${destination.price}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{destination.duration} days</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              <span>{destination.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

