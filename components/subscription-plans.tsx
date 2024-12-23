import { Check, Star } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '$0.00',
    description:
      'Perfect for casual travelers who need basic travel planning and recommendations.',
    targetMarket: 'Casual Traveler',
    vacationDeals: '-',
    rewardsProgram: '-',
    aiAssistant: '3 responses weekly',
    ads: 'With Ads',
    collaboration: 'Up to 2 people',
    features: [
      'Basic AI-powered destination recommendations',
      'Basic trip planning tools',
      'Collaborative trip planning for up to 2 users',
      'Community forum access',
      'Basic travel guides',
    ],
  },
  {
    name: 'Premium',
    price: '$7.99',
    description:
      'Ideal for frequent travelers needing more support and occasional travel deals.',
    targetMarket: 'Frequent Traveler',
    vacationDeals: 'Occasional Deals',
    rewardsProgram: 'Points on Each Purchase',
    aiAssistant: 'Unlimited talk',
    ads: 'No Ads',
    collaboration: 'Up to 6 people',
    features: [
      'All Free Version features',
      'Advanced AI-powered trip customization',
      'Collaborative trip planning for up to 6 users',
      'Priority customer support (12-hour response time)',
      'Exclusive travel deals and discounts',
      'Offline access to saved trips',
      'Advanced budget tracking and expense categorization',
      'Basic travel risk assessment',
    ],
  },
  {
    name: 'Enterprise',
    price: '($125 Fixed) + $3 per individual',
    description: 'For small-large organizations with group travelers.',
    targetMarket: 'Medium-Large Organizations (25+ individuals)',
    vacationDeals: 'Deals on Every Purchase',
    rewardsProgram: 'Rewards on Every Dollar Spent',
    aiAssistant: 'Unlimited talk + Account Specialist',
    ads: 'No Ads',
    collaboration: 'Unlimited people',
    features: [
      'All Premium Version features',
      'Dedicated account specialist for tailored recommendations',
      'Customizable travel policies and reports',
      'Collaborative trip planning for 6+ users',
      'Real-time travel alerts for all users',
      'Dedicated enterprise support',
      'Advanced travel risk assessment and security briefings',
      'Corporate travel management tools',
      'API access for custom integrations',
      'Exclusive access to luxury travel experiences and VIP airport services',
    ],
  },
];

export default function SubscriptionPlans() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Choose Your Placeaway Experience
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md p-6 flex flex-col ${index === 1 ? 'border-2 border-amber-500' : ''}`}
            >
              {index === 1 && (
                <div className="flex items-center justify-center bg-orange-500 text-white py-2 px-4 rounded-full text-sm font-semibold mb-4 -mt-10 mx-auto">
                  <Star className="w-4 h-4 mr-1" /> Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2 text-gray-800">
                {plan.name}
              </h3>
              <p className="text-4xl font-bold mb-4 text-turquoise-600">
                {plan.price}
                <span className="text-base font-normal text-gray-600">
                  /month
                </span>
              </p>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  index === 1
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Need a custom plan for your organization?
          </p>
          <button className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition-colors">
            Contact Sales for Enterprise Solutions
          </button>
        </div>
      </div>
    </section>
  );
}
