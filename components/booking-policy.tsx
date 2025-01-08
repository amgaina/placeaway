import { Info, CheckCircle } from 'lucide-react';
import { AbstractLines } from './decorative-elements';

export default function BookingPolicy() {
  return (
    <section className="relative py-16 bg-gradient-to-br from-teal-50 to-blue-50 overflow-hidden">
      <AbstractLines className="text-teal-200 opacity-30 top-0 right-0" />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Understanding Your Booking
        </h2>
        <div className="bg-white rounded-lg shadow-xl p-8 relative overflow-hidden">
          <AbstractLines className="text-blue-100 opacity-20 bottom-0 left-0" />
          <div className="relative z-10">
            <div className="flex items-start mb-6">
              <Info className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-1" />
              <p className="text-gray-600 leading-relaxed">
                At TripZen, we strive to provide you with the best travel
                experience. Our services include both advisory assistance and
                direct bookings. Please note that refund policies may vary
                depending on the type of service or package you choose.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-amber-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-amber-700">
                  Placeaway Packages
                </h3>
                <ul className="space-y-3">
                  {[
                    'Refunds available as per our policy for packages booked directly through TripZen',
                    'Cancellation terms clearly stated at the time of booking',
                    'Our support team can assist with the refund process',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  External Bookings
                </h3>
                <ul className="space-y-3">
                  {[
                    'For bookings made through our partners, refund policies of the respective service provider apply',
                    "We'll guide you to the appropriate channel for refund requests",
                    'Our team can provide support in communicating with external providers',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                For detailed information about booking terms and refund
                policies, please refer to our{' '}
                <a
                  href="/terms"
                  className="text-teal-600 hover:underline font-medium"
                >
                  Terms of Service
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
