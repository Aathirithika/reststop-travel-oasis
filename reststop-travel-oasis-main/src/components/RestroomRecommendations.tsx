
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Restroom } from "@/types";
import { getRecommendedRestrooms } from "@/data/userRestrooms";
import { RestroomCard } from "./RestroomCard";
import { Route } from "lucide-react";

interface RestroomRecommendationsProps {
  restrooms: Restroom[];
  onSelectRestroom: (id: string) => void;
}

export function RestroomRecommendations({
  restrooms,
  onSelectRestroom
}: RestroomRecommendationsProps) {
  const [accessibility, setAccessibility] = useState(false);
  const [babyChanging, setBabyChanging] = useState(false);
  const [genderNeutral, setGenderNeutral] = useState(false);
  const [minCleanliness, setMinCleanliness] = useState(70);
  const [preferFuelStations, setPreferFuelStations] = useState(false);
  const [recommendedRestrooms, setRecommendedRestrooms] = useState<Restroom[]>([]);
  const [hasRecommendations, setHasRecommendations] = useState(false);

  const handleGetRecommendations = () => {
    let recommendations = getRecommendedRestrooms(restrooms, {
      accessibility,
      babyChanging,
      genderNeutral,
      minCleanliness
    });
    
    // If fuel station preference is set, prioritize fuel stations
    if (preferFuelStations) {
      // Separate fuel stations from others
      const fuelStations = recommendations.filter(
        r => r.businessInfo?.type === 'gas_station'
      );
      const others = recommendations.filter(
        r => r.businessInfo?.type !== 'gas_station'
      );
      
      // Concatenate with fuel stations first
      recommendations = [...fuelStations, ...others].slice(0, 5);
    }
    
    setRecommendedRestrooms(recommendations);
    setHasRecommendations(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Personalized Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rec-accessibility"
                checked={accessibility}
                onCheckedChange={(checked) => setAccessibility(!!checked)}
              />
              <Label htmlFor="rec-accessibility">Must be accessible</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="rec-babyChanging"
                checked={babyChanging}
                onCheckedChange={(checked) => setBabyChanging(!!checked)}
              />
              <Label htmlFor="rec-babyChanging">Must have baby changing station</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="rec-genderNeutral"
                checked={genderNeutral}
                onCheckedChange={(checked) => setGenderNeutral(!!checked)}
              />
              <Label htmlFor="rec-genderNeutral">Must be gender neutral</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="rec-fuelStations"
                checked={preferFuelStations}
                onCheckedChange={(checked) => setPreferFuelStations(!!checked)}
              />
              <Label htmlFor="rec-fuelStations" className="flex items-center gap-1">
                <span>Prefer fuel stations</span>
              </Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cleanlinessScore">
              Minimum Cleanliness Score: {minCleanliness}
            </Label>
            <Slider
              id="cleanlinessScore"
              min={0}
              max={100}
              step={5}
              value={[minCleanliness]}
              onValueChange={(values) => setMinCleanliness(values[0])}
            />
          </div>
          
          <Button className="w-full" onClick={handleGetRecommendations}>
            Get Recommendations
          </Button>
        </div>
        
        {hasRecommendations && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">Recommended Restrooms</h3>
            {recommendedRestrooms.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No restrooms match your preferences. Try adjusting your filters.
              </p>
            ) : (
              <div className="space-y-2">
                {recommendedRestrooms.map((restroom) => (
                  <RestroomCard
                    key={restroom.id}
                    restroom={restroom}
                    onClick={() => onSelectRestroom(restroom.id)}
                    isSelected={false}
                    isRecommended={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
