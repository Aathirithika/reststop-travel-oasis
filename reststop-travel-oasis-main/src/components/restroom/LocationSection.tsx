
import { Restroom } from "@/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock8, Sparkles, Building, Coffee, Utensils, Hotel, Cake } from "lucide-react";

interface LocationSectionProps {
  restroom: Restroom;
}

export function LocationSection({ restroom }: LocationSectionProps) {
  // Function to get the appropriate business icon
  const getBusinessIcon = () => {
    if (!restroom.businessInfo) return null;
    
    switch(restroom.businessInfo.type) {
      case 'cafe':
        return <Coffee size={20} className="text-reststop-primary" />;
      case 'restaurant':
        return <Utensils size={20} className="text-reststop-primary" />;
      case 'hotel':
        return <Hotel size={20} className="text-reststop-primary" />;
      case 'bakery':
        return <Cake size={20} className="text-reststop-primary" />;
      default:
        return <Building size={20} className="text-muted-foreground" />;
    }
  };
  
  return (
    <div className="bg-white dark:bg-reststop-dark rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-start gap-2">
            <MapPin className="text-reststop-primary mt-1" size={18} />
            <div>
              <div className="font-medium">{restroom.location.address || 'No address available'}</div>
              {restroom.location.city && (
                <div className="text-sm text-muted-foreground">
                  {restroom.location.city}, {restroom.location.state}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {restroom.businessInfo && (
          <Badge className="flex items-center gap-1">
            {getBusinessIcon()}
            {restroom.businessInfo.type.replace('_', ' ')}
          </Badge>
        )}
      </div>
      
      {restroom.businessInfo?.partnerStatus !== 'none' && (
        <div className="flex items-center gap-1 mt-2">
          <Sparkles size={14} className="text-yellow-500" />
          <span className="text-sm font-medium">
            {restroom.businessInfo?.partnerStatus === 'premium' 
              ? 'Premium Partner' 
              : 'Standard Partner'}
          </span>
        </div>
      )}
      
      {restroom.businessInfo?.openHours && (
        <div className="flex items-center gap-1 mt-2 text-sm">
          <Clock8 size={14} className="text-muted-foreground" />
          <span>{restroom.businessInfo.openHours}</span>
        </div>
      )}
    </div>
  );
}
