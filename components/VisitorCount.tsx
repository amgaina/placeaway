'use client';

import React from 'react';
import { useBooking } from '@/app/booking/[place]/BookingContext';
import { Check } from 'lucide-react';

interface VisitorCountProps {
  onNext: () => void;
}

export default function VisitorCount({ onNext }: VisitorCountProps) {
  const { state, dispatch } = useBooking();

  const setVisitorCount = (count: number) => {
    dispatch({ type: 'SET_VISITOR_COUNT', payload: Math.max(1, count) });
  };

  const togglePets = () => {
    dispatch({ type: 'SET_HAS_PETS', payload: !state.hasPets });
  };

  const toggleChildren = () => {
    dispatch({ type: 'SET_HAS_CHILDREN', payload: !state.hasChildren });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setVisitorCount(value);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-semibold mb-8 text-center">
        Who&apos;s joining your adventure?
      </h2>

      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <label
          htmlFor="visitorCount"
          className="block text-xl font-medium text-gray-700 mb-4"
        >
          Number of visitors
        </label>
        <div className="flex items-center justify-center space-x-6">
          <button
            className="bg-indigo-500 text-white w-12 h-12 rounded-full text-2xl hover:bg-indigo-600 transition-colors"
            onClick={() => setVisitorCount(state.visitorCount - 1)}
            aria-label="Decrease visitor count"
          >
            -
          </button>
          <input
            type="number"
            id="visitorCount"
            value={state.visitorCount}
            onChange={handleInputChange}
            min="1"
            className="text-4xl font-bold w-24 text-center bg-transparent border-b-2 border-indigo-300 focus:outline-none focus:border-indigo-500"
            aria-label="Number of visitors"
          />
          <button
            className="bg-indigo-500 text-white w-12 h-12 rounded-full text-2xl hover:bg-indigo-600 transition-colors"
            onClick={() => setVisitorCount(state.visitorCount + 1)}
            aria-label="Increase visitor count"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between bg-gray-50 p-6 rounded-lg shadow-md">
          <span className="text-xl font-medium text-gray-700">
            Are you traveling with pets?
          </span>
          <button
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
              state.hasPets ? 'bg-indigo-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={togglePets}
            aria-checked={state.hasPets}
            role="checkbox"
          >
            {state.hasPets && <Check className="text-white" size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-6 rounded-lg shadow-md">
          <span className="text-xl font-medium text-gray-700">
            Are you traveling with children under 14?
          </span>
          <button
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
              state.hasChildren
                ? 'bg-indigo-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={toggleChildren}
            aria-checked={state.hasChildren}
            role="checkbox"
          >
            {state.hasChildren && <Check className="text-white" size={20} />}
          </button>
        </div>
      </div>

      <button
        className="w-full mt-12 bg-indigo-600 text-white px-8 py-3 rounded-lg text-xl hover:bg-indigo-700 transition-colors"
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
}
