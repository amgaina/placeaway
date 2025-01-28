import Image from 'next/image';
import { useState } from 'react';

export const ImageGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={images[activeIndex]}
          alt="Place"
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute bottom-2 right-2 flex gap-1">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full ${
              i === activeIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
