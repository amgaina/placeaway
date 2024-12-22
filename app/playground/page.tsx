'use client'

import { useState, useEffect } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AbstractLines, AbstractShapes } from '@/components/decorative-elements'
import { ElementInterface, TripPlayground } from '@/components/trip-playground'
import { AiTripPlanner } from '@/components/ai-trip-planner'
import { CollaborationPanel } from '@/components/collaboration-panel'

export default function PlaygroundPage() {
  const [tripData, setTripData] = useState<{
    destinations: string[];
    duration: number;
    travelers: number;
    elements:ElementInterface[];
  } | null>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    // In a real application, you would fetch the initial trip data from your backend
    const mockTripData: {
      destinations: string[];
      duration: number;
      travelers: number;
      elements: ElementInterface[];
    } = {
      destinations: ['New York', 'Washington D.C.', 'Boston'],
      duration: 10,
      travelers: 2,
      elements: [
        {
          id: 'flight1',
          type: 'flight',
          details: {
            description: 'Flight to New York',
            price: 300,
            airline: 'Delta Airlines',
            flightNumber: 'DL1234',
            departureTime: '2023-07-01 08:00 AM',
            arrivalTime: '2023-07-01 10:30 AM',
            duration: '2h 30m'
          }
        },
        {
          id: 'hotel1',
          type: 'hotel',
          details: {
            description: 'Hotel in New York',
            price: 800,
            checkIn: '2023-07-01 03:00 PM',
            checkOut: '2023-07-04 11:00 AM',
            roomType: 'Deluxe Double',
            pricePerNight: 266.67
          }
        },
        {
          id: 'activity1',
          type: 'activity',
          details: {
            description: 'Visit Statue of Liberty',
            price: 30,
            date: '2023-07-02',
            duration: '3 hours',
            location: 'Liberty Island',
            additionalInfo: 'Includes ferry ride and audio guide'
          }
        },
        {
          id: 'transport1',
          type: 'transport',
          details: {
            description: 'Train to Washington D.C.',
            price: 100,
            transportType: 'train',
            departureTime: '2023-07-04 01:00 PM',
            arrivalTime: '2023-07-04 04:30 PM',
            duration: '3h 30m',
            distance: '225 miles'
          }
        },
        {
          id: 'hotel2',
          type: 'hotel',
          details: {
            description: 'Hotel in Washington D.C.',
            price: 750,
            checkIn: '2023-07-04 03:00 PM',
            checkOut: '2023-07-07 11:00 AM',
            roomType: 'Executive Suite',
            pricePerNight: 250
          }
        },
        {
          id: 'activity2',
          type: 'activity',
          details: {
            description: 'Visit White House',
            price: 0,
            date: '2023-07-05',
            duration: '1 hour',
            location: '1600 Pennsylvania Avenue NW',
            additionalInfo: 'Free public tour, reservation required'
          }
        },
        {
          id: 'transport2',
          type: 'transport',
          details: {
            description: 'Drive to Boston',
            price: 120,
            transportType: 'car',
            departureTime: '2023-07-07 10:00 AM',
            arrivalTime: '2023-07-07 03:30 PM',
            duration: '5h 30m',
            distance: '440 miles',
            gasPrice: 50
          }
        },
        {
          id: 'hotel3',
          type: 'hotel',
          details: {
            description: 'Hotel in Boston',
            price: 700,
            checkIn: '2023-07-07 03:00 PM',
            checkOut: '2023-07-10 11:00 AM',
            roomType: 'City View King',
            pricePerNight: 233.33
          }
        },
        {
          id: 'activity3',
          type: 'activity',
          details: {
            description: 'Freedom Trail Tour',
            price: 40,
            date: '2023-07-08',
            duration: '2 hours',
            location: 'Boston Common',
            additionalInfo: 'Guided walking tour of historic sites'
          }
        },
        {
          id: 'flight2',
          type: 'flight',
          details: {
            description: 'Flight from Boston',
            price: 280,
            airline: 'JetBlue',
            flightNumber: 'B6789',
            departureTime: '2023-07-10 07:00 PM',
            arrivalTime: '2023-07-10 09:15 PM',
            duration: '2h 15m'
          }
        },
      ]
    }
    setTripData(mockTripData)
  }, [])

  const handleTripUpdate = (updatedTrip: typeof tripData) => {
    setTripData(updatedTrip)
    // In a real application, you would send the updated trip data to your backend
  }

  const handleAiPlanGenerated = (generatedPlan: typeof tripData) => {
    setTripData(generatedPlan)
    // In a real application, you might want to merge this with existing data or handle it differently
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
    if (!isFullScreen) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <AbstractShapes className="absolute text-amber-100 opacity-30 top-0 right-0" />
      <AbstractLines className="absolute text-gray-200 opacity-30 bottom-0 left-0" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Trip Playground</h1>
          <Button
            onClick={toggleFullScreen}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            {isFullScreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
          </Button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {tripData && (
              <TripPlayground
                tripData={tripData}
                onTripUpdate={(updatedTrip) => handleTripUpdate({ ...updatedTrip, destinations: tripData.destinations })}
                onSaveDraft={() => alert('Draft saved!')}
              />
            )}
          </div>
          <div className="lg:w-1/3 space-y-8">
            <AiTripPlanner onPlanGenerated={handleAiPlanGenerated} />
            <CollaborationPanel tripId="unique-trip-id" />
          </div>
        </div>
      </div>
    </div>
  )
}

