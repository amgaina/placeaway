'use client';

import React, { useState } from 'react';
import Slider from 'react-slick';
import { useParams, useRouter } from 'next/navigation';
import { useBooking } from './BookingContext';
import VisitorCount from '@/components/VisitorCount';
import DateSelection from '@/components/DateSelection';
import Interests from '@/components/Interests';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function BookingSlider() {
  const [sliderRef, setSliderRef] = useState<Slider | null>(null);
  const { state } = useBooking();
  const params = useParams();
  const router = useRouter();
  const place = params.place as string;

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const handleSubmit = () => {
    const queryParams = new URLSearchParams({
      destination: place,
      visitors: state.visitorCount.toString(),
      hasPets: state.hasPets.toString(),
      hasChildren: state.hasChildren.toString(),
      startDate: state.startDate ? state.startDate.toISOString() : '',
      endDate: state.endDate ? state.endDate.toISOString() : '',
      interests: state.interests.join(','),
    }).toString();

    router.push(`/booking/${place}/confirmation?${queryParams}`);
  };

  const handleBack = () => {
    sliderRef?.slickPrev();
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl p-12">
      <Slider ref={(slider) => setSliderRef(slider)} {...settings}>
        <VisitorCount onNext={() => sliderRef?.slickNext()} />
        <DateSelection
          onNext={() => sliderRef?.slickNext()}
          onBack={handleBack}
        />
        <Interests onSubmit={handleSubmit} onBack={handleBack} />
      </Slider>
    </div>
  );
}
