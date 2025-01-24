'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function ExpandableDescription({
  description,
}: {
  description: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <p className={`text-gray-600 ${isExpanded ? '' : 'line-clamp-3'}`}>
        {description}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-500 hover:text-blue-600 mt-2 flex items-center"
      >
        {isExpanded ? 'Read less' : 'Read more'}
        {isExpanded ? (
          <ChevronUp className="ml-1 w-4 h-4" />
        ) : (
          <ChevronDown className="ml-1 w-4 h-4" />
        )}
      </button>
    </div>
  );
}
