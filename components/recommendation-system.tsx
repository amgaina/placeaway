import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export function RecommendationSystem() {
  const [activeTab, setActiveTab] = useState('activities')

  const recommendations = {
    activities: [
      { id: 1, name: 'Visit the Eiffel Tower', price: 25, availability: 'High' },
      { id: 2, name: 'Louvre Museum Tour', price: 20, availability: 'Medium' },
      { id: 3, name: 'Seine River Cruise', price: 15, availability: 'Low' },
    ],
    hotels: [
      { id: 1, name: 'Grand Hotel Paris', price: 200, availability: 'Low' },
      { id: 2, name: 'Cozy Parisian Apartment', price: 150, availability: 'High' },
      { id: 3, name: 'Luxury Suite Hotel', price: 300, availability: 'Medium' },
    ],
    flights: [
      { id: 1, name: 'Direct Flight to Paris', price: 500, availability: 'Medium' },
      { id: 2, name: 'Budget Airline', price: 300, availability: 'High' },
      { id: 3, name: 'First Class Experience', price: 1000, availability: 'Low' },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
          </TabsList>
          {Object.entries(recommendations).map(([category, items]) => (
            <TabsContent key={category} value={category}>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <div className="text-sm">
                      <span className="mr-2">${item.price}</span>
                      <span className={`px-2 py-1 rounded ${getAvailabilityColor(item.availability)}`}>
                        {item.availability}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-4">View More {category}</Button>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

function getAvailabilityColor(availability) {
  switch (availability) {
    case 'High':
      return 'bg-green-100 text-green-800'
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'Low':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

