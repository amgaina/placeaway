import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className={cn(
        'flex justify-center items-center min-h-[100px]',
        className,
      )}
    >
      <div
        className={cn(
          'border-4 border-primary/20 border-t-primary rounded-full animate-spin',
          sizeClasses[size],
        )}
      />
      <div className="sr-only">Loading...</div>
    </div>
  );
};

export default LoadingIndicator;
