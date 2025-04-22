
import { Restroom } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Accessibility, Baby, Users } from "lucide-react";

interface AmenitiesSectionProps {
  restroom: Restroom;
}

export function AmenitiesSection({ restroom }: AmenitiesSectionProps) {
  return (
    <div className="bg-white dark:bg-reststop-dark rounded-lg shadow p-4">
      <h3 className="font-medium mb-3">Amenities</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {restroom.accessibility && (
          <Badge className="flex items-center gap-1">
            <Accessibility size={14} />
            <span>Accessible</span>
          </Badge>
        )}
        {restroom.babyChanging && (
          <Badge className="flex items-center gap-1">
            <Baby size={14} />
            <span>Baby Changing</span>
          </Badge>
        )}
        {restroom.genderNeutral && (
          <Badge className="flex items-center gap-1">
            <Users size={14} />
            <span>Gender Neutral</span>
          </Badge>
        )}
        {restroom.amenities.map((amenity, index) => (
          <Badge key={index} variant="outline">
            {amenity.replace('_', ' ')}
          </Badge>
        ))}
      </div>
    </div>
  );
}
