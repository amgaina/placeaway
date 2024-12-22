import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: 'Explorer',
    price: '$9.99',
    description: 'Perfect for casual travelers',
    features: [
      'AI-powered destination recommendations',
      'Basic trip planning tools',
      'Limited itinerary storage (up to 3 trips)',
      'Community forum access',
      'Email support (24-hour response time)',
      'Basic travel guides',
      'Standard booking options'
    ]
  },
  {
    name: 'Pathfinder',
    price: '$24.99',
    description: 'Ideal for regular travelers and small businesses',
    features: [
      'All Explorer features',
      'Advanced AI trip customization',
      'Unlimited itinerary storage',
      'Collaborative trip planning for up to 5 users',
      'Priority customer support (12-hour response time)',
      'Exclusive travel deals and discounts',
      'Offline access to saved trips',
      'Advanced budget tracking and expense categorization',
      'Integration with major expense management tools',
      'Basic travel risk assessment'
    ]
  },
  {
    name: 'Globetrotter',
    price: '$49.99',
    description: 'For frequent travelers, travel agencies, and corporations',
    features: [
      'All Pathfinder features',
      'Premium AI travel assistant with voice integration',
      'Unlimited collaborative trip planning',
      'VIP customer support with dedicated account manager',
      'Real-time flight and hotel price alerts',
      'Advanced travel risk assessment and security briefings',
      'Corporate travel policy compliance tools',
      'Customizable reporting and analytics dashboard',
      'API access for custom integrations',
      'Exclusive access to luxury travel experiences and VIP airport services',
      'Carbon footprint tracking and offset options'
    ]
  }
]

export default function SubscriptionPlans() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Choose Your TripZen Experience</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-lg shadow-md p-6 flex flex-col ${index === 1 ? 'border-2 border-amber-500' : ''}`}>
              {index === 1 && (
                <div className="flex items-center justify-center bg-orange-500 text-white py-2 px-4 rounded-full text-sm font-semibold mb-4 -mt-10 mx-auto">
                  <Star className="w-4 h-4 mr-1" /> Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2 text-gray-800">{plan.name}</h3>
              <p className="text-4xl font-bold mb-4 text-turquoise-600">{plan.price}<span className="text-base font-normal text-gray-600">/month</span></p>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2 px-4 rounded-md transition-colors ${
                index === 1 
                  ? 'bg-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}>
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Need a custom plan for your organization?</p>
          <button className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition-colors">
            Contact Sales for Enterprise Solutions
          </button>
        </div>
      </div>
    </section>
  )
}

