// components/ui/progress.tsx
import React from 'react';

interface ProgressProps {
  value: number; // A value between 0 and 100
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  return (
    <div
      className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-blue-500 transition-width duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
