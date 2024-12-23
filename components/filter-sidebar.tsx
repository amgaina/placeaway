'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

export default function FilterSidebar({
  onFilterChange,
}: {
  onFilterChange: (filters: any) => void;
}) {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 5000,
    duration: 14,
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-md mr-8">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">All Categories</option>
          <option value="Adventure">Adventure</option>
          <option value="Cultural">Cultural</option>
          <option value="Relaxation">Relaxation</option>
          <option value="Culinary">Culinary</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Price Range
        </label>
        <div className="flex justify-between">
          <span>${filters.minPrice}</span>
          <span>${filters.maxPrice}</span>
        </div>
        <Slider
          min={0}
          max={5000}
          step={100}
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={(value) => {
            handleFilterChange('minPrice', value[0]);
            handleFilterChange('maxPrice', value[1]);
          }}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Max Duration (days)
        </label>
        <Slider
          min={1}
          max={30}
          step={1}
          value={[filters.duration]}
          onValueChange={(value) => handleFilterChange('duration', value[0])}
        />
        <span>{filters.duration} days</span>
      </div>
    </div>
  );
}
