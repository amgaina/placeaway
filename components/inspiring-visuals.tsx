import Image from 'next/image';

export default function InspiringVisuals() {
  // In a real application, you would fetch these from your backend or a content management system
  const visualContent = [
    {
      id: 1,
      type: 'image',
      image: '/images/place_image/northern_lights.png',
      name: 'Breathtaking view of the Northern Lights',
      text: 'Northern Lights',
    },
    {
      id: 2,
      type: 'video',
      image: '/images/place_image/ocean.mp4',
      poster: '/placeholder.svg?height=400&width=600',
      text: 'Aerial view of a tropical island',
    },
    {
      id: 3,
      type: 'image',
      image: '/images/place_image/sunset.png',
      name: 'Serene beach at sunset',
      text: 'Serene beach at sunset',
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Inspiring Visuals
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visualContent.map((content) => (
          <div
            key={content.id}
            className="rounded-lg overflow-hidden shadow-md"
          >
            {content.type === 'image' ? (
              <Image
                src={content.image}
                alt={content.name || 'Inspiring visual'}
                width={1200}
                height={800}
                className="w-full h-64 object-cover"
              />
            ) : (
              <video
                src={content.image}
                poster={content.poster}
                controls
                className="w-full h-64 object-cover"
              >
                Your browser does not support the video tag.
              </video>
            )}
            <h1 className="p-4 text-center">{content.text}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
