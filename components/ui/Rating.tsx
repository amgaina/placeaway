import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export function Rating({ value, onChange, readonly }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(rating)}
          className={`${rating <= value ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          <Star className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
