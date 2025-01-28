import { PlaceDetails } from '@/services/GoogleMapsService';
import { StarRating } from './StarRating';
import { ReviewCard } from './ReviewCard';

interface ReviewsListProps {
  reviews: PlaceDetails['reviews'];
  rating: number;
  total: number;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  rating,
  total,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarRating rating={rating} />
          <span className="text-sm text-gray-600">
            {rating.toFixed(1)} ({total} reviews)
          </span>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>
    </div>
  );
};
