'use client';

import React, { useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    '/Images/Carousel/carousel-1.png',
    '/Images/Carousel/carousel-2.png',
    '/Images/Carousel/carousel-3.png',
    '/Images/Carousel/carousel-4.png',
    '/Images/Carousel/carousel-5.png',
    '/Images/Carousel/carousel-6.png',
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    beforeChange: (oldIndex: number, newIndex: number) =>
      setCurrentSlide(newIndex),
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Slider {...settings} className="h-full">
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-screen">
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>
        ))}
      </Slider>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-5 h-5 rounded-full ${
              currentSlide === index ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
