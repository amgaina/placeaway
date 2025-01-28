import { PlaceReviewData } from '@/services/GoogleMapsService';
import { format } from 'date-fns';
import { StarRating } from './StarRating';

interface ReviewCardProps {
  review: PlaceReviewData;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="p-3 rounded-lg bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium">{review.author}</p>
          <p className="text-xs text-gray-500">
            {format(new Date(review.time), 'PPP')}
          </p>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">{review.text}</p>
    </div>
  );
};
