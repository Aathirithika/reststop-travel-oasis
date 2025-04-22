import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Map } from "@/components/Map";
import { RestroomCard } from "@/components/RestroomCard";
import { RestroomDetail } from "@/components/RestroomDetail";
import { Chatbot } from "@/components/Chatbot";
import { ThemeProvider } from "@/hooks/use-theme";
import { Restroom } from "@/types";
import { getAllRestrooms, getRestroomsByLocation, defaultLocation } from "@/data/restrooms";
import { getUserRestrooms, getNearbyRestrooms } from "@/data/userRestrooms";
import { Button } from "@/components/ui/button";
import { MapPin, List, Plus, Filter } from "lucide-react";
import { AddRestroomForm } from "@/components/AddRestroomForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Index = () => {
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [currentLocation, setCurrentLocation] = useState(defaultLocation);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [isDetailView, setIsDetailView] = useState(false);
  const [isAddingRestroom, setIsAddingRestroom] = useState(false);
  const [filterRadius, setFilterRadius] = useState<number>(2);
  const [isUsingLocation, setIsUsingLocation] = useState(false);
  const [totalRestroomCount, setTotalRestroomCount] = useState(0);

  useEffect(() => {
    // Load the total count of predefined and user-added restrooms
    const allRestrooms = [...getAllRestrooms(), ...getUserRestrooms()];
    setTotalRestroomCount(allRestrooms.length);
    
    // Get user's geolocation if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setCurrentLocation(userLocation);
          setIsUsingLocation(true);
          
          // Load nearby restrooms based on user's location and filter radius
          const nearbyRestrooms = [
            ...getRestroomsByLocation(userLocation.lat, userLocation.lng, filterRadius),
            ...getNearbyRestrooms(userLocation.lat, userLocation.lng, filterRadius)
          ];
          
          setRestrooms(nearbyRestrooms);
          
          // Show notification about nearby restrooms
          if (nearbyRestrooms.length === 0) {
            toast.warning(`No restrooms found within ${filterRadius}km of your location`);
          } else {
            toast.success(`Found ${nearbyRestrooms.length} restrooms within ${filterRadius}km of your location`);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default location and load all restrooms
          loadAllRestrooms();
          toast.error("Couldn't access your location. Showing all restrooms instead.");
        }
      );
    } else {
      // Geolocation not available, load all restrooms
      loadAllRestrooms();
    }
    
    // Display a welcome message specific to Coimbatore
    console.log("Welcome to RestStop Coimbatore, Tamil Nadu!");
  }, []);
  
  // Update restrooms when filter radius changes
  useEffect(() => {
    if (isUsingLocation) {
      const nearbyRestrooms = [
        ...getRestroomsByLocation(currentLocation.lat, currentLocation.lng, filterRadius),
        ...getNearbyRestrooms(currentLocation.lat, currentLocation.lng, filterRadius)
      ];
      
      setRestrooms(nearbyRestrooms);
      
      // Show notification about filter radius change
      if (nearbyRestrooms.length === 0) {
        toast.warning(`No restrooms found within ${filterRadius}km of your location`);
      } else {
        toast.info(`Showing ${nearbyRestrooms.length} restrooms within ${filterRadius}km of your location`);
      }
    }
  }, [filterRadius, currentLocation, isUsingLocation]);
  
  const loadAllRestrooms = () => {
    const allRestrooms = [...getAllRestrooms(), ...getUserRestrooms()];
    setRestrooms(allRestrooms);
  };

  const handleSearch = (query: string) => {
    // Always search in the full dataset
    if (!query) {
      if (isUsingLocation) {
        // If using location, reapply the location filter
        const nearbyRestrooms = [
          ...getRestroomsByLocation(currentLocation.lat, currentLocation.lng, filterRadius),
          ...getNearbyRestrooms(currentLocation.lat, currentLocation.lng, filterRadius)
        ];
        setRestrooms(nearbyRestrooms);
      } else {
        // Otherwise load all restrooms
        loadAllRestrooms();
      }
      return;
    }
    
    // Search in the complete dataset
    const allData = [...getAllRestrooms(), ...getUserRestrooms()];
    const filtered = allData.filter(
      restroom => 
        restroom.name.toLowerCase().includes(query.toLowerCase()) ||
        (restroom.description && restroom.description.toLowerCase().includes(query.toLowerCase())) ||
        (restroom.location.address && restroom.location.address.toLowerCase().includes(query.toLowerCase()))
    );
    
    setRestrooms(filtered);
  };

  const handleSelectRestroom = (id: string) => {
    setSelectedId(id);
    setIsDetailView(true);
  };

  const handleBackFromDetail = () => {
    setIsDetailView(false);
  };

  const handleAddRestroom = () => {
    setIsAddingRestroom(true);
  };

  const handleRestroomAdded = (newRestrooms: Restroom[]) => {
    // Update the restrooms list to include user-added restrooms
    if (isUsingLocation) {
      // If using location, reapply the location filter
      const nearbyRestrooms = [
        ...getRestroomsByLocation(currentLocation.lat, currentLocation.lng, filterRadius),
        ...getNearbyRestrooms(currentLocation.lat, currentLocation.lng, filterRadius)
      ];
      setRestrooms(nearbyRestrooms);
    } else {
      // Otherwise load all restrooms
      const allRestrooms = [...getAllRestrooms(), ...newRestrooms];
      setRestrooms(allRestrooms);
    }
    
    // Update total count
    setTotalRestroomCount(getAllRestrooms().length + newRestrooms.length);
    setIsAddingRestroom(false);
  };

  const handleCancelAddRestroom = () => {
    setIsAddingRestroom(false);
  };
  
  const handleRadiusChange = (value: string) => {
    setFilterRadius(Number(value));
  };

  // -- Add this function to focus map on selected restroom and switch to map view --
  const handleShowOnMap = (restroomId: string) => {
    setViewMode("map");
    setIsDetailView(false);
    setSelectedId(restroomId);
    toast.info("Centered map on restroom location.");
  };

  const selectedRestroom = restrooms.find(r => r.id === selectedId);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header onSearch={handleSearch} />
        
        <main className="flex-1 container grid md:grid-cols-12 gap-4 py-4">
          {isAddingRestroom ? (
            <div className="col-span-12">
              <AddRestroomForm 
                onRestroomAdded={handleRestroomAdded}
                onCancel={handleCancelAddRestroom}
              />
            </div>
          ) : !isDetailView ? (
            <>
              <div className="md:col-span-8 order-2 md:order-1">
                {viewMode === "map" ? (
                  <Map 
                    restrooms={restrooms} 
                    currentLocation={currentLocation}
                    selectedId={selectedId}
                    onSelectRestroom={handleSelectRestroom}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {restrooms.length === 0 ? (
                      <div className="col-span-full flex items-center justify-center h-64 text-muted-foreground">
                        No restrooms found matching your criteria
                      </div>
                    ) : (
                      restrooms.map(restroom => (
                        <RestroomCard 
                          key={restroom.id} 
                          restroom={restroom}
                          onClick={() => handleSelectRestroom(restroom.id)}
                          isSelected={restroom.id === selectedId}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-4 order-1 md:order-2">
                <div className="bg-white dark:bg-reststop-dark rounded-lg shadow-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">RestStop Coimbatore</h2>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={viewMode === "map" ? "default" : "outline"}
                        onClick={() => setViewMode("map")}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Map
                      </Button>
                      <Button 
                        size="sm" 
                        variant={viewMode === "list" ? "default" : "outline"}
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4 mr-1" />
                        List
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <strong>{restrooms.length}</strong> of <strong>{totalRestroomCount}</strong> restrooms shown
                      </div>
                      
                      {isUsingLocation && (
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <Select defaultValue={filterRadius.toString()} onValueChange={handleRadiusChange}>
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Radius" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 km</SelectItem>
                              <SelectItem value="2">2 km</SelectItem>
                              <SelectItem value="3">3 km</SelectItem>
                              <SelectItem value="4">4 km</SelectItem>
                              <SelectItem value="5">5 km</SelectItem>
                              <SelectItem value="6">6 km</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Top rated restrooms</h3>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleAddRestroom}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add New
                        </Button>
                      </div>
                      {restrooms
                        .sort((a, b) => b.cleanliness.score - a.cleanliness.score)
                        .slice(0, 3)
                        .map(restroom => (
                          <RestroomCard
                            key={restroom.id}
                            restroom={restroom}
                            onClick={() => handleSelectRestroom(restroom.id)}
                            isSelected={restroom.id === selectedId}
                          />
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : selectedRestroom ? (
            <div className="col-span-12">
              <RestroomDetail 
                restroom={selectedRestroom}
                onBack={handleBackFromDetail}
                onShowOnMap={() => handleShowOnMap(selectedRestroom.id)}
              />
            </div>
          ) : (
            <div className="col-span-12 flex items-center justify-center h-64">
              <p>Restroom not found</p>
            </div>
          )}
        </main>
        
        <Chatbot onFindNearbyRestrooms={handleSearch} />
      </div>
    </ThemeProvider>
  );
};

export default Index;
