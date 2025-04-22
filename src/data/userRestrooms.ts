
import { Restroom } from "../types";
import { defaultLocation } from "./restrooms";

// Custom user-added restrooms for Coimbatore
const userRestrooms: Restroom[] = [
  // This array will store user-added restrooms
];

// Import the fuel station dataset
const fuelStationDataset = [
  {
    "Name": "Fuel Station Vadavalli #1542",
    "Location": "Vadavalli, Coimbatore",
    "Type": "Petrol Bunk",
    "Cleanliness Rating": 4.4,
    "Accessibility": "Yes",
    "Review": "Excellent cleanliness and well-equipped with essentials.",
    "Tag": "clean",
    "Coordinates": { "lat": 11.0272, "lng": 76.8991 }
  },
  {
    "Name": "Fuel Station Podanur #1543",
    "Location": "Podanur, Coimbatore",
    "Type": "Petrol Bunk",
    "Cleanliness Rating": 4.1,
    "Accessibility": "Yes",
    "Review": "Hygienic environment, spotless and comfortable.",
    "Tag": "clean",
    "Coordinates": { "lat": 10.9907, "lng": 76.9723 }
  },
  {
    "Name": "Fuel Station Saibaba Colony #1544",
    "Location": "Saibaba Colony, Coimbatore",
    "Type": "Petrol Bunk",
    "Cleanliness Rating": 2.2,
    "Accessibility": "Yes",
    "Review": "Unhygienic and poorly maintained.",
    "Tag": "dirty",
    "Coordinates": { "lat": 11.0268, "lng": 76.9346 }
  },
  {
    "Name": "Fuel Station Saravanampatti #1545",
    "Location": "Saravanampatti, Coimbatore",
    "Type": "Petrol Bunk",
    "Cleanliness Rating": 2.5,
    "Accessibility": "Yes",
    "Review": "Average cleanliness, can be improved.",
    "Tag": "moderate",
    "Coordinates": { "lat": 11.0791, "lng": 77.0061 }
  },
  {
    "Name": "Fuel Station Ganapathy #1546",
    "Location": "Ganapathy, Coimbatore",
    "Type": "Petrol Bunk",
    "Cleanliness Rating": 4.7,
    "Accessibility": "Yes",
    "Review": "Hygienic environment, spotless and comfortable.",
    "Tag": "clean",
    "Coordinates": { "lat": 11.0352, "lng": 76.9991 }
  },
  {
    "Name": "Fuel Station Thudiyalur #1547",
    "Location": "Thudiyalur, Coimbatore",
    "Type": "Petrol Bunk",
    "Cleanliness Rating": 3.1,
    "Accessibility": "Yes",
    "Review": "Not very bad, but could be more hygienic.",
    "Tag": "moderate",
    "Coordinates": { "lat": 11.0712, "lng": 76.9452 }
  },
  {
    "Name": "Fuel Station Sulur #1548",
    "Location": "Sulur, Coimbatore",
    "Type": "Petrol Bunk",
    "Cleanliness Rating": 3.7,
    "Accessibility": "Yes",
    "Review": "Excellent cleanliness and well-equipped with essentials.",
    "Tag": "clean",
    "Coordinates": { "lat": 11.0286, "lng": 77.1285 }
  },
  // Additional locations in Coimbatore for better district-wide coverage
  {
    "Name": "Fuel Station Singanallur #1549",
    "Location": "Singanallur, Coimbatore",
    "Type": "Petrol Bunk",
    "Cleanliness Rating": 4.3,
    "Accessibility": "Yes",
    "Review": "Very clean facilities and well maintained.",
    "Tag": "clean",
    "Coordinates": { "lat": 11.0073, "lng": 77.0281 }
  },
  {
    "Name": "Fuel Station RS Puram #1550",
    "Location": "RS Puram, Coimbatore",
    "Type": "Petrol Bunk",
    "Cleanliness Rating": 4.5,
    "Accessibility": "Yes",
    "Review": "Excellent facilities, very hygienic and comfortable.",
    "Tag": "clean",
    "Coordinates": { "lat": 11.0083, "lng": 76.9514 }
  },
  {
    "Name": "Fuel Station Peelamedu #1551",
    "Location": "Peelamedu, Coimbatore",
    "Type": "Petrol Bunk",
    "Cleanliness Rating": 3.8,
    "Accessibility": "Yes",
    "Review": "Good maintenance and cleanliness standards.",
    "Tag": "clean",
    "Coordinates": { "lat": 11.0183, "lng": 77.0066 }
  },
  {
    "Name": "Fuel Station Ukkadam #1552",
    "Location": "Ukkadam, Coimbatore",
    "Type": "Petrol Bunk",
    "Cleanliness Rating": 2.9,
    "Accessibility": "Yes",
    "Review": "Average facilities, needs improvement in cleanliness.",
    "Tag": "moderate",
    "Coordinates": { "lat": 10.9925, "lng": 76.9567 }
  }
];

// Function to convert the fuel station dataset to Restroom format
const convertDatasetToRestrooms = (): Restroom[] => {
  return fuelStationDataset.map((station, index) => {
    // Use the station's Coordinates directly (they are now guaranteed to exist)
    const locationCoords = station.Coordinates;
    
    // Extract location parts
    const locationParts = station.Location.split(', ');
    const area = locationParts[0] || '';
    
    // Convert cleanliness rating from 5-point scale to 100-point scale
    const cleanlinessScore = Math.round(station["Cleanliness Rating"] * 20);
    
    // Determine amenities based on tag
    const amenities = ["toilet", "sink"];
    if (station.Tag === "clean") {
      amenities.push("hand_soap", "paper_towels");
    }
    
    return {
      id: `fuel-${index + 1}`,
      name: station.Name,
      description: `${station.Type} restroom in ${area}`,
      location: {
        lat: locationCoords.lat,
        lng: locationCoords.lng,
        address: station.Location,
        city: "Coimbatore",
        state: "Tamil Nadu"
      },
      amenities: amenities,
      cleanliness: {
        score: cleanlinessScore,
        lastUpdated: new Date().toISOString(),
        reports: Math.floor(Math.random() * 50) + 10  // Random number of reports between 10-60
      },
      accessibility: station.Accessibility === "Yes",
      babyChanging: Math.random() > 0.5, // Randomly assign baby changing facilities
      genderNeutral: Math.random() > 0.7, // Randomly assign gender neutral status
      reviews: [
        {
          id: `review-fuel-${index + 1}`,
          userId: `user-${Math.floor(Math.random() * 1000)}`,
          userName: "Dataset User",
          rating: Math.round(station["Cleanliness Rating"]),
          comment: station.Review,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
          cleanliness: Math.round(station["Cleanliness Rating"])
        }
      ],
      businessInfo: {
        type: "gas_station",
        partnerStatus: station.Tag === "clean" ? "premium" : "standard",
        openHours: "24/7"
      }
    };
  });
};

// Initialize the user restrooms with the converted dataset
const datasetRestrooms = convertDatasetToRestrooms();
userRestrooms.push(...datasetRestrooms);

// Function to add a new restroom to the dataset
export const addRestroom = (restroom: Restroom): Restroom[] => {
  // Create a new restroom with generated ID if not provided
  const newRestroom = {
    ...restroom,
    id: restroom.id || `user-${Date.now()}`,
  };
  
  // Add to user restrooms
  userRestrooms.push(newRestroom);
  
  // Return updated list
  return [...userRestrooms];
};

// Get all user-added restrooms
export const getUserRestrooms = (): Restroom[] => {
  return [...userRestrooms];
};

// Calculate distance between two coordinates using the Haversine formula
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

// Get restrooms near a specific location
export const getNearbyRestrooms = (
  lat: number, 
  lng: number, 
  radiusInKm: number = 2
): Restroom[] => {
  return userRestrooms.filter(restroom => {
    const distance = calculateDistance(
      lat, 
      lng, 
      restroom.location.lat, 
      restroom.location.lng
    );
    
    return distance <= radiusInKm;
  });
};

// Function to get recommendations based on user preferences
export const getRecommendedRestrooms = (
  allRestrooms: Restroom[], 
  preferences: { 
    accessibility?: boolean;
    babyChanging?: boolean;
    genderNeutral?: boolean;
    minCleanliness?: number;
  }
): Restroom[] => {
  // Filter restrooms based on user preferences
  let recommended = allRestrooms.filter(restroom => {
    // If accessibility is important and restroom is not accessible, exclude
    if (preferences.accessibility && !restroom.accessibility) return false;
    
    // If baby changing is important and restroom doesn't have it, exclude
    if (preferences.babyChanging && !restroom.babyChanging) return false;
    
    // If gender neutral is important and restroom is not gender neutral, exclude
    if (preferences.genderNeutral && !restroom.genderNeutral) return false;
    
    // If minimum cleanliness score is set and restroom scores below it, exclude
    if (preferences.minCleanliness && restroom.cleanliness.score < preferences.minCleanliness) return false;
    
    // Include this restroom in recommendations
    return true;
  });
  
  // Sort by cleanliness score
  recommended.sort((a, b) => b.cleanliness.score - a.cleanliness.score);
  
  // Return top recommendations (limit to 5)
  return recommended.slice(0, 5);
};

// Get restrooms by area name in Coimbatore district
export const getRestroomsByArea = (areaName: string): Restroom[] => {
  const normalizedAreaName = areaName.toLowerCase();
  
  return userRestrooms.filter(restroom => 
    restroom.name.toLowerCase().includes(normalizedAreaName) || 
    (restroom.location.address && restroom.location.address.toLowerCase().includes(normalizedAreaName))
  );
};

// Search restrooms by multiple criteria (name, description, address, etc.)
export const searchRestrooms = (searchTerm: string): Restroom[] => {
  const normalizedSearch = searchTerm.toLowerCase();
  
  return userRestrooms.filter(restroom => 
    restroom.name.toLowerCase().includes(normalizedSearch) || 
    (restroom.description && restroom.description.toLowerCase().includes(normalizedSearch)) ||
    (restroom.location.address && restroom.location.address.toLowerCase().includes(normalizedSearch)) ||
    (restroom.location.city && restroom.location.city.toLowerCase().includes(normalizedSearch))
  );
};
