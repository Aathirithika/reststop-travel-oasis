
import { useState } from "react";
import { Restroom } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReviewItem } from "@/components/reviews/ReviewItem";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";

interface ReviewsSectionProps {
  restroom: Restroom;
}

export function ReviewsSection({ restroom }: ReviewsSectionProps) {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  
  return (
    <div className="bg-white dark:bg-reststop-dark rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Reviews</h3>
        <Button variant="outline" size="sm" onClick={() => setReviewDialogOpen(true)}>Add Review</Button>
      </div>
      
      <ScrollArea className="h-60">
        {restroom.reviews.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No reviews yet
          </div>
        ) : (
          <div className="space-y-3">
            {restroom.reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        )}
      </ScrollArea>
      
      <ReviewDialog 
        open={reviewDialogOpen} 
        onOpenChange={setReviewDialogOpen} 
        restroomName={restroom.name} 
      />
    </div>
  );
}
