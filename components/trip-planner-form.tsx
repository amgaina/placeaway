'use client'

import { useState } from 'react'
import { PlusCircle, MinusCircle, Calendar, Users, MapPin, Loader } from 'lucide-react'
import { DateRangePicker } from './date-range-picker'

export function TripPlannerForm({ onGeneratePlan, isLoading }) {
  const [destinations, setDestinations] = useState([{ id: 1, name: '' }])
  const [travelers, setTravelers] = useState(1)
  const [dateRange, setDateRange] = useState({ from: null, to: null })

  const addDestination = () => {
    setDestinations([...destinations, { id: Date.now(), name: '' }])
  }

  const removeDestination = (id: number) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter(dest => dest.id !== id))
    }
  }

  const updateDestination = (id: number, name: string) => {
    setDestinations(destinations.map(dest => dest.id === id ? { ...dest, name } : dest))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onGeneratePlan({ destinations, travelers, dateRange })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Plan Your Trip</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Where do you want to go?</label>
          {destinations.map((dest, index) => (
            <div key={dest.id} className="flex items-center mb-2">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={dest.name}
                onChange={(e) => updateDestination(dest.id, e.target.value)}
                placeholder={`Destination ${index + 1}`}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              />
              {index === destinations.length - 1 ? (
                <PlusCircle
                  className="h-6 w-6 text-amber-500 ml-2 cursor-pointer"
                  onClick={addDestination}
                />
              ) : (
                <MinusCircle
                  className="h-6 w-6 text-red-500 ml-2 cursor-pointer"
                  onClick={() => removeDestination(dest.id)}
                />
              )}
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">When do you want to travel?</label>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">How many travelers?</label>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="number"
              min="1"
              value={travelers}
              onChange={(e) => setTravelers(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading ? 'bg-gray-400' : 'bg-amber-500 hover:bg-amber-600'
          } text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center`}
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Generating AI-Powered Trip Plan...
            </>
          ) : (
            'Generate AI-Powered Trip Plan'
          )}
        </button>
      </div>
    </form>
  )
}

