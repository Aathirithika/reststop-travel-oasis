import { useState, useEffect } from "react";
import { Restroom } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Route } from "lucide-react";
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
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);

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

  const calculateRoute = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setCalculating(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const origin = `${position.coords.latitude},${position.coords.longitude}`;
      const destination = `${restroom.location.lat},${restroom.location.lng}`;
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&mode=driving&units=metric&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.rows[0]?.elements[0]?.distance && data.rows[0]?.elements[0]?.duration) {
        setDistance(data.rows[0].elements[0].distance.text);
        setDuration(data.rows[0].elements[0].duration.text);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      toast({
        title: "Error",
        description: "Could not calculate route. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCalculating(false);
    }
  };

  const handleGetDirections = () => {
    // Calculate route first
    calculateRoute();
    
    // Open Google Maps with directions
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

      {(distance || duration) && (
        <div className="bg-muted/50 rounded-lg p-3 mb-4 flex items-center gap-2">
          <Route className="text-primary" size={20} />
          <div>
            <p className="text-sm font-medium">
              Distance: {distance}
              {duration && <span className="mx-1">•</span>}
              {duration && `${duration} by car`}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 flex-1 overflow-y-auto pb-4">
        <LocationSection restroom={restroom} />
        <CleanlinessSection restroom={restroom} formatDate={formatDate} />
        <AmenitiesSection restroom={restroom} />
        <ReviewsSection restroom={restroom} />
      </div>
      
      <div className="mt-auto pt-4">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleReportCleanliness}>Report Cleanliness</Button>
          <Button 
            variant="secondary" 
            onClick={handleGetDirections}
            disabled={calculating}
          >
            {calculating ? 'Calculating...' : 'Get Directions'}
          </Button>
        </div>
      </div>
    </div>
  );
}
