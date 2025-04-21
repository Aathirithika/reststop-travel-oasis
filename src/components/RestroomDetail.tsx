
import { useState } from "react";
import { Restroom } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LocationSection } from "@/components/restroom/LocationSection";
import { CleanlinessSection } from "@/components/restroom/CleanlinessSection";
import { AmenitiesSection } from "@/components/restroom/AmenitiesSection";
import { ReviewsSection } from "@/components/restroom/ReviewsSection";

interface RestroomDetailProps {
  restroom: Restroom;
  onBack: () => void;
  onShowOnMap?: () => void;
}

export function RestroomDetail({ restroom, onBack, onShowOnMap }: RestroomDetailProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleReportCleanliness = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for reporting the cleanliness status.",
    });
  };

  const handleGetDirections = () => {
    // Open Google Maps with directions to the restroom
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${restroom.location.lat},${restroom.location.lng}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-semibold flex-1">{restroom.name}</h2>
        {onShowOnMap && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 ml-2"
            onClick={onShowOnMap}
          >
            <MapPin size={16} />
            Show on Map
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 flex-1 overflow-y-auto pb-4">
        <LocationSection restroom={restroom} />
        <CleanlinessSection restroom={restroom} formatDate={formatDate} />
        <AmenitiesSection restroom={restroom} />
        <ReviewsSection restroom={restroom} />
      </div>
      
      <div className="mt-auto pt-4">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleReportCleanliness}>Report Cleanliness</Button>
          <Button variant="secondary" onClick={handleGetDirections}>Get Directions</Button>
        </div>
      </div>
    </div>
  );
}
