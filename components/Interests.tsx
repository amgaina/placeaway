'use client';

import React, { useState } from 'react';
import { useBooking } from '@/app/booking/[place]/BookingContext';

interface InterestsProps {
  onSubmit: () => void;
  onBack: () => void;
}

const commonInterests = [
  'Hiking',
  'Eating local dishes',
  'Swimming',
  'Dancing',
  'Arts and culture',
  'Historical sites',
  'Adventure sports',
  'Photography',
  'Wildlife watching',
  'Relaxation',
];

export default function Interests({ onSubmit, onBack }: InterestsProps) {
  const { state, dispatch } = useBooking();
  const [customInterest, setCustomInterest] = useState('');

  const setInterests = (interests: string[]) => {
    dispatch({ type: 'SET_INTERESTS', payload: interests });
  };

  const toggleInterest = (interest: string) => {
    setInterests(
      state.interests.includes(interest)
        ? state.interests.filter((i) => i !== interest)
        : [...state.interests, interest],
    );
  };

  const addCustomInterest = () => {
    if (customInterest && !state.interests.includes(customInterest)) {
      setInterests([...state.interests, customInterest]);
      setCustomInterest('');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-8">What are your interests?</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {commonInterests.map((interest) => (
          <button
            key={interest}
            onClick={() => toggleInterest(interest)}
            className={`px-6 py-3 rounded-full text-lg ${
              state.interests.includes(interest)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } transition-colors`}
          >
            {interest}
          </button>
        ))}
      </div>
      <div className="flex mb-8">
        <input
          type="text"
          value={customInterest}
          onChange={(e) => setCustomInterest(e.target.value)}
          placeholder="Add your own interest"
          className="flex-grow p-3 text-lg border-2 border-indigo-300 rounded-l-md focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        />
        <button
          onClick={addCustomInterest}
          className="bg-indigo-600 text-white px-6 py-3 rounded-r-md text-lg hover:bg-indigo-700 transition-colors"
        >
          Add
        </button>
      </div>
      <div className="flex justify-between mt-8">
        <button
          className="bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-xl hover:bg-gray-400 transition-colors"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-xl hover:bg-indigo-700 transition-colors"
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
