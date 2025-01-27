import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) => {
        if (i < fullStars) {
          return (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          );
        }
        if (i === fullStars && hasHalfStar) {
          return (
            <StarHalf
              key={i}
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
            />
          );
        }
        return <Star key={i} className="w-4 h-4 text-gray-300" />;
      })}
    </div>
  );
};
