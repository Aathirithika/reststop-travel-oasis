
import { Review } from "@/types";
import { Star } from "lucide-react";

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const reviewDate = new Date(review.date);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="pb-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">{review.userName}</div>
        <div className="text-sm text-muted-foreground">{formatDate(reviewDate)}</div>
      </div>
      <div className="flex items-center gap-1 mt-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
          />
        ))}
        <span className="text-sm ml-1">
          {review.cleanliness}/5 cleanliness
        </span>
      </div>
      {review.comment && (
        <div className="text-sm mt-1">{review.comment}</div>
      )}
    </div>
  );
}
