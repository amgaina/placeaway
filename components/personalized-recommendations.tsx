import Image from 'next/image';

export default function PersonalizedRecommendations() {
  // In a real application, you would fetch personalized recommendations from your backend
  const recommendations = [
    {
      id: 1,
      name: 'Kyoto',
      image: '/images/place_image/kyoto.png',
      description: 'Traditional Japanese culture',
    },
    {
      id: 2,
      name: 'Santorini',
      image: '/images/place_image/santorini.png',
      description: 'Stunning Greek island',
    },
    {
      id: 3,
      name: 'New York City',
      image: '/images/place_image/new_york_city.png',
      description: 'The city that never sleeps',
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Recommended for You
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Image
              src={rec.image}
              alt={rec.name}
              width={500}
              height={200}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{rec.name}</h3>
              <p className="text-gray-600 text-sm">{rec.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
