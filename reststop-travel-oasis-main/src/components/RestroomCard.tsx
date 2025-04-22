import { Restroom } from "@/types";
import { getCleanlinessTier } from "@/data/restrooms";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toilet, Clock, Accessibility, Baby, Users, Star, Coffee, Utensils, Hotel, Cake } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestroomCardProps {
  restroom: Restroom;
  onClick: () => void;
  isSelected?: boolean;
  isRecommended?: boolean;
}

export function RestroomCard({ restroom, onClick, isSelected = false, isRecommended = false }: RestroomCardProps) {
  const cleanlinessTier = getCleanlinessTier(restroom.cleanliness.score);
  const lastUpdatedDate = new Date(restroom.cleanliness.lastUpdated);
  const minutesAgo = Math.floor((Date.now() - lastUpdatedDate.getTime()) / 60000);
  const hoursAgo = Math.floor(minutesAgo / 60);
  
  const timeAgo = hoursAgo >= 1 
    ? `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago` 
    : `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;

  // Function to get the appropriate business icon
  const getBusinessIcon = () => {
    if (!restroom.businessInfo) return null;
    
    switch(restroom.businessInfo.type) {
      case 'cafe':
        return <Coffee size={16} className="text-reststop-primary" />;
      case 'restaurant':
        return <Utensils size={16} className="text-reststop-primary" />;
      case 'hotel':
        return <Hotel size={16} className="text-reststop-primary" />;
      case 'bakery':
        return <Cake size={16} className="text-reststop-primary" />;
      default:
        return null;
    }
  };
  
  const businessIcon = getBusinessIcon();
  const isPartner = restroom.businessInfo?.partnerStatus && restroom.businessInfo.partnerStatus !== 'none';

  return (
    <Card 
      className={`restroom-card transition-all ${isSelected ? 'border-reststop-primary border-2' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <CardTitle>{restroom.name}</CardTitle>
            {businessIcon && isPartner && (
              <div className="flex items-center" aria-label="Partnership Venue">
                {businessIcon}
              </div>
            )}
            {isRecommended && (
              <Star size={16} className="fill-yellow-400 text-yellow-400" aria-label="Recommended for you" />
            )}
          </div>
          <Badge variant={
            cleanlinessTier === 'high' ? 'secondary' : 
            cleanlinessTier === 'medium' ? 'outline' : 
            'destructive'
          }>
            {restroom.cleanliness.score}/100
          </Badge>
        </div>
        <CardDescription className="line-clamp-1">
          {restroom.location.address || "Address not available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {restroom.accessibility && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Accessibility size={12} />
              <span>Accessible</span>
            </Badge>
          )}
          {restroom.babyChanging && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Baby size={12} />
              <span>Baby Changing</span>
            </Badge>
          )}
          {restroom.genderNeutral && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Users size={12} />
              <span>Gender Neutral</span>
            </Badge>
          )}
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock size={14} className="mr-1" />
          <span>Updated {timeAgo}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full" onClick={onClick}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
