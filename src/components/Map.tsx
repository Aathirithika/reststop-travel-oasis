
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import { Icon, LatLng } from "leaflet";
import { Toilet, Star, Route, Navigation } from "lucide-react";
import { Restroom } from "@/types";
import { getCleanlinessTier } from "@/data/restrooms";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";

interface MapProps {
  restrooms: Restroom[];
  currentLocation: { lat: number; lng: number };
  selectedId?: string;
  onSelectRestroom: (id: string) => void;
}

// Custom marker icon (keep existing code for createRestroomIcon function)
const createRestroomIcon = (cleanlinessTier: 'high' | 'medium' | 'low') => {
  const color = cleanlinessTier === 'high' ? '#27ae60' : 
                cleanlinessTier === 'medium' ? '#f39c12' : 
                '#e74c3c';
  
  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${
      cleanlinessTier === 'high' ? 'green' : 
      cleanlinessTier === 'medium' ? 'orange' : 
      'red'
    }.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Component to update the map view and handle routing
function MapUpdater({ 
  center, 
  selectedRestroom,
  userLocation 
}: { 
  center: [number, number]; 
  selectedRestroom?: Restroom;
  userLocation?: GeolocationPosition;
}) {
  const map = useMap();
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [routeDetails, setRouteDetails] = useState<{ distance: string; duration: string } | null>(null);
  
  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  useEffect(() => {
    if (selectedRestroom && userLocation) {
      // Calculate and display route using OSRM (Open Source Routing Machine)
      const fetchRoute = async () => {
        try {
          const startLat = userLocation.coords.latitude;
          const startLng = userLocation.coords.longitude;
          const endLat = selectedRestroom.location.lat;
          const endLng = selectedRestroom.location.lng;

          console.log(`Calculating route from [${startLat}, ${startLng}] to [${endLat}, ${endLng}]`);
          
          // Use OSRM public API for routing (no API key required)
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
          );
          
          const data = await response.json();
          
          if (data.routes && data.routes.length > 0) {
            // Extract the coordinates from the response
            const coordinates = data.routes[0].geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
            );
            
            setRoutePath(coordinates);
            
            // Calculate and display route details
            const distanceInKm = (data.routes[0].distance / 1000).toFixed(1);
            const durationInMin = Math.round(data.routes[0].duration / 60);
            
            setRouteDetails({
              distance: `${distanceInKm} km`,
              duration: `${durationInMin} min`
            });

            // Fit map bounds to show the entire route
            if (coordinates.length > 0) {
              const bounds = coordinates.reduce((bounds: any, coord: [number, number]) => {
                return bounds.extend(coord);
              }, new LatLng(coordinates[0][0], coordinates[0][1]).toBounds(500));
              
              map.fitBounds(bounds, { padding: [50, 50] });
            }
            
            toast.success("Route calculated successfully!");
          } else {
            console.error('No routes found:', data);
            toast.error("Could not calculate route between locations");
          }
        } catch (error) {
          console.error('Error fetching route:', error);
          toast.error("Could not calculate route. Please try again.");
        }
      };

      fetchRoute();
    } else {
      // Clear route when no restroom is selected
      setRoutePath([]);
      setRouteDetails(null);
    }
  }, [selectedRestroom, userLocation, map]);

  return (
    <>
      {routePath.length > 0 && (
        <Polyline 
          positions={routePath}
          color="#0077ff"
          weight={4}
          opacity={0.8}
        />
      )}
      {routeDetails && (
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg z-[1000]">
          <div className="flex items-center gap-2">
            <Route className="text-primary" size={16} />
            <div className="text-sm">
              <strong>{routeDetails.distance}</strong>
              <span className="mx-1">•</span>
              <span>{routeDetails.duration} by car</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Map({ restrooms, currentLocation, selectedId, onSelectRestroom }: MapProps) {
  const [activeId, setActiveId] = useState<string | undefined>(selectedId);
  const [userLocation, setUserLocation] = useState<GeolocationPosition>();
  
  useEffect(() => {
    setActiveId(selectedId);
    
    // Request user location when a restroom is selected
    if (selectedId && !userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation(position);
            toast.success("Location access granted. Calculating route...");
          },
          (error) => {
            console.error('Error getting location:', error);
            toast.error("Location access required to see directions. Please enable location services.");
          }
        );
      }
    }
  }, [selectedId, userLocation]);

  // When user explicitly changes the selected restroom, try to get their location again
  const handleSelectRestroom = (id: string) => {
    setActiveId(id);
    onSelectRestroom(id);
    
    // If we don't have the user's location yet, try to get it
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
          toast.success("Location access granted. Calculating route...");
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error("Location access required to see directions. Please enable location services.");
        }
      );
    }
  };

  const selectedRestroom = restrooms.find(r => r.id === selectedId);

  return (
    <div className="map-container h-[calc(100vh-12rem)] md:h-[calc(100vh-4rem)]">
      <MapContainer
        center={[currentLocation.lat, currentLocation.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater 
          center={[currentLocation.lat, currentLocation.lng]} 
          selectedRestroom={selectedRestroom}
          userLocation={userLocation}
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.coords.latitude, userLocation.coords.longitude]}
            icon={new Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Restroom markers */}
        {restrooms.map(restroom => {
          const cleanlinessTier = getCleanlinessTier(restroom.cleanliness.score);
          const isActive = activeId === restroom.id;
          
          return (
            <Marker
              key={restroom.id}
              position={[restroom.location.lat, restroom.location.lng]}
              icon={createRestroomIcon(cleanlinessTier)}
              eventHandlers={{
                click: () => {
                  handleSelectRestroom(restroom.id);
                },
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-semibold text-lg">{restroom.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <span className={`cleanliness-${cleanlinessTier} font-medium`}>
                      {restroom.cleanliness.score}/100
                    </span>
                    <span className="text-muted-foreground">
                      ({restroom.cleanliness.reports} reports)
                    </span>
                  </div>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRestroom(restroom.id);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
