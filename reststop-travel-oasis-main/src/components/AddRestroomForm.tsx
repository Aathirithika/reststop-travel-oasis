
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { addRestroom } from "@/data/userRestrooms";
import { Restroom } from "@/types";
import { defaultLocation } from "@/data/restrooms";

interface AddRestroomFormProps {
  onRestroomAdded: (newRestrooms: Restroom[]) => void;
  onCancel: () => void;
}

export function AddRestroomForm({ onRestroomAdded, onCancel }: AddRestroomFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [accessibility, setAccessibility] = useState(false);
  const [babyChanging, setBabyChanging] = useState(false);
  const [genderNeutral, setGenderNeutral] = useState(false);
  const [businessType, setBusinessType] = useState<
    "gas_station" | "cafe" | "restaurant" | "hotel" | "public" | "other"
  >("public");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim() || !address.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name and address for the restroom.",
        variant: "destructive",
      });
      return;
    }

    // Create new restroom object
    const newRestroom: Restroom = {
      id: `user-${Date.now()}`,
      name,
      description,
      location: {
        lat: defaultLocation.lat + (Math.random() * 0.01 - 0.005), // Random location near default
        lng: defaultLocation.lng + (Math.random() * 0.01 - 0.005), // Random location near default
        address,
        city: "Coimbatore",
        state: "Tamil Nadu"
      },
      amenities: ["toilet", "sink"],
      cleanliness: {
        score: 85, // Default good score for user-added restrooms
        lastUpdated: new Date().toISOString(),
        reports: 1
      },
      accessibility,
      babyChanging,
      genderNeutral,
      reviews: [],
      businessInfo: {
        type: businessType,
        partnerStatus: "none",
        openHours: "9:00 AM - 9:00 PM"
      }
    };

    // Add to user restrooms
    const updatedRestrooms = addRestroom(newRestroom);
    
    // Notify parent component
    onRestroomAdded(updatedRestrooms);
    
    // Show success message
    toast({
      title: "Restroom Added",
      description: "Your restroom has been added successfully!",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Restroom</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Restroom Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Coffee Corner Restroom"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of the restroom"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 123 RS Puram Main Road"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessType">Type</Label>
            <Select value={businessType} onValueChange={(value: any) => setBusinessType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="cafe">Cafe</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="gas_station">Gas Station</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="accessibility"
                checked={accessibility}
                onCheckedChange={(checked) => setAccessibility(!!checked)}
              />
              <Label htmlFor="accessibility">Accessible</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="babyChanging"
                checked={babyChanging}
                onCheckedChange={(checked) => setBabyChanging(!!checked)}
              />
              <Label htmlFor="babyChanging">Baby Changing Station</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="genderNeutral"
                checked={genderNeutral}
                onCheckedChange={(checked) => setGenderNeutral(!!checked)}
              />
              <Label htmlFor="genderNeutral">Gender Neutral</Label>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Restroom</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
