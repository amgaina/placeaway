export default function InspiringVisuals() {
  // In a real application, you would fetch these from your backend or a content management system
  const visualContent = [
    { id: 1, type: 'image', src: '/placeholder.svg?height=400&width=600', alt: 'Breathtaking view of the Northern Lights' },
    { id: 2, type: 'video', src: 'https://example.com/sample-video.mp4', poster: '/placeholder.svg?height=400&width=600' },
    { id: 3, type: 'image', src: '/placeholder.svg?height=400&width=600', alt: 'Serene beach at sunset' },
  ]

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Inspiring Visuals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visualContent.map((content) => (
          <div key={content.id} className="rounded-lg overflow-hidden shadow-md">
            {content.type === 'image' ? (
              <img src={content.src} alt={content.alt} className="w-full h-64 object-cover" />
            ) : (
              <video 
                src={content.src} 
                poster={content.poster} 
                controls 
                className="w-full h-64 object-cover"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

