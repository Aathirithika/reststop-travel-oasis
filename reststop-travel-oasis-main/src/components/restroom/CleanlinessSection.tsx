
import { Restroom } from "@/types";
import { getCleanlinessTier } from "@/data/restrooms";
import { Clock } from "lucide-react";

interface CleanlinessSectionProps {
  restroom: Restroom;
  formatDate: (date: Date) => string;
}

export function CleanlinessSection({ restroom, formatDate }: CleanlinessSectionProps) {
  const cleanlinessTier = getCleanlinessTier(restroom.cleanliness.score);
  const lastUpdated = new Date(restroom.cleanliness.lastUpdated);
  
  return (
    <div className="bg-white dark:bg-reststop-dark rounded-lg shadow p-4">
      <h3 className="font-medium mb-3">Cleanliness</h3>
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-4 border-solid border-reststop-primary">
          <span className="text-2xl font-bold">{restroom.cleanliness.score}</span>
        </div>
        <div>
          <div className={`font-medium text-lg cleanliness-${cleanlinessTier}`}>
            {cleanlinessTier === 'high' 
              ? 'Very Clean' 
              : cleanlinessTier === 'medium' 
                ? 'Moderately Clean' 
                : 'Needs Cleaning'}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock size={14} />
            <span>Updated {formatDate(lastUpdated)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {restroom.cleanliness.reports} cleanliness reports
          </div>
        </div>
      </div>
    </div>
  );
}
