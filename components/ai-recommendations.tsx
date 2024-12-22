import { Plane, Hotel, Car, Ticket } from 'lucide-react'

export function AIRecommendations() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">AI-Powered Recommendations</h2>
      <p className="text-gray-600 mb-6">
        Our AI assistant has generated the following recommendations based on your preferences. You can modify these options or let our AI optimize your trip for the best balance of time and cost efficiency.
      </p>
      <div className="space-y-6">
        <RecommendationItem
          icon={Plane}
          title="Flight"
          description="Round-trip, Economy Class"
          details={[
            "Departure: Austin-Bergstrom International Airport (AUS)",
            "Arrival: John F. Kennedy International Airport (JFK)",
            "Airline: American Airlines",
          ]}
        />
        <RecommendationItem
          icon={Hotel}
          title="Accommodation"
          description="4-star hotel in Manhattan"
          details={[
            "Hotel: The New Yorker, A Wyndham Hotel",
            "Room: Standard Double Room",
            "Amenities: Free Wi-Fi, Fitness Center",
          ]}
        />
        <RecommendationItem
          icon={Car}
          title="Transportation"
          description="Subway passes and occasional taxi"
          details={[
            "7-day unlimited MetroCard",
            "Estimated taxi budget: $100",
          ]}
        />
        <RecommendationItem
          icon={Ticket}
          title="Activities"
          description="Top-rated New York experiences"
          details={[
            "Visit to the Statue of Liberty and Ellis Island",
            "Skip-the-line tickets to the Empire State Building",
            "Guided tour of the Metropolitan Museum of Art",
          ]}
        />
      </div>
    </div>
  )
}

function RecommendationItem({ icon: Icon, title, description, details }) {
  return (
    <div className="flex items-start">
      <div className="bg-amber-100 rounded-full p-3 mr-4">
        <Icon className="h-6 w-6 text-amber-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-2">{description}</p>
        <ul className="list-disc list-inside text-sm text-gray-500">
          {details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

