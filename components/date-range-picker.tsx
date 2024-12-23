'use client';

import { useState } from 'react';

interface DateRangePickerProps {
  dateRange: { from: string; to: string };
  onDateRangeChange: (dateRange: { from: string; to: string }) => void;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [fromDate, setFromDate] = useState(dateRange.from || '');
  const [toDate, setToDate] = useState(dateRange.to || '');

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    onDateRangeChange({ from: newFromDate, to: toDate });
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToDate = e.target.value;
    setToDate(newToDate);
    onDateRangeChange({ from: fromDate, to: newToDate });
  };

  return (
    <div className="flex space-x-2">
      <input
        type="date"
        value={fromDate}
        onChange={handleFromDateChange}
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
      />
      <span className="text-gray-500 self-center">to</span>
      <input
        type="date"
        value={toDate}
        onChange={handleToDateChange}
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
      />
    </div>
  );
}
