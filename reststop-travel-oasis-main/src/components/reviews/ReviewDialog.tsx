import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Image } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restroomName: string;
}

export function ReviewDialog({ open, onOpenChange, restroomName }: ReviewDialogProps) {
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewCleanliness, setReviewCleanliness] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState<FileList | null>(null);
  
  const handleReviewSubmit = () => {
    if (!reviewImages || reviewImages.length === 0) {
      toast({
        title: "Image Required",
        description: "Please upload at least one image with your review",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Review Submitted",
      description: "Thank you for your review and uploaded images!",
    });
    
    // Remind user to review again after some time
    setTimeout(() => {
      toast({
        title: "Review Reminder",
        description: `How was your experience at ${restroomName}? Consider leaving another review!`,
      });
    }, 1000 * 60 * 60 * 24); // 24 hours later
    
    onOpenChange(false);
    setReviewRating(5);
    setReviewCleanliness(5);
    setReviewComment("");
    setReviewImages(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
          <DialogDescription>
            Share your experience at {restroomName}. Upload images to help others.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="rating">Overall Rating</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="rating"
                min={1}
                max={5}
                step={1}
                value={[reviewRating]}
                onValueChange={(values) => setReviewRating(values[0])}
              />
              <span className="font-medium w-8">{reviewRating}/5</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cleanliness">Cleanliness Rating</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="cleanliness"
                min={1}
                max={5}
                step={1}
                value={[reviewCleanliness]}
                onValueChange={(values) => setReviewCleanliness(values[0])}
              />
              <span className="font-medium w-8">{reviewCleanliness}/5</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Your Comments</Label>
            <Textarea
              id="comment"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="images">Upload Images (Optional)</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md h-32 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <label htmlFor="images" className="cursor-pointer flex flex-col items-center justify-center">
                  <Image size={24} className="text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">Click to upload images</p>
                  <Input 
                    id="images" 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => setReviewImages(e.target.files)}
                  />
                </label>
              </div>
              {reviewImages && reviewImages.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {reviewImages.length} image{reviewImages.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleReviewSubmit}>Submit Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
