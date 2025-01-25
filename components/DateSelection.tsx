'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import { useBooking } from '@/app/booking/[place]/BookingContext';

import 'react-datepicker/dist/react-datepicker.css';

interface DateSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export default function DateSelection({ onNext, onBack }: DateSelectionProps) {
  const { state, dispatch } = useBooking();

  const setStartDate = (date: Date | null) => {
    dispatch({ type: 'SET_START_DATE', payload: date });
  };

  const setEndDate = (date: Date | null) => {
    dispatch({ type: 'SET_END_DATE', payload: date });
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-8">Select your travel dates</h2>
      <div className="flex justify-between space-x-8">
        <div className="flex-1">
          <label className="block text-xl font-medium text-gray-700 mb-2">
            From
          </label>
          <DatePicker
            selected={state.startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={state.startDate}
            endDate={state.endDate}
            minDate={tomorrow}
            maxDate={threeMonthsLater}
            className="w-full p-3 text-lg border-2 border-indigo-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            inline
          />
        </div>
        <div className="flex-1">
          <label className="block text-xl font-medium text-gray-700 mb-2">
            To
          </label>
          <DatePicker
            selected={state.endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={state.startDate}
            endDate={state.endDate}
            minDate={state.startDate || tomorrow}
            maxDate={threeMonthsLater}
            className="w-full p-3 text-lg border-2 border-indigo-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            inline
          />
        </div>
      </div>
      <div className="flex justify-between mt-12">
        <button
          className="bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-xl hover:bg-gray-400 transition-colors"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-xl hover:bg-indigo-700 transition-colors"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
