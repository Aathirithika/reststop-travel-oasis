import { Restroom } from "../types";

// Coimbatore, Tamil Nadu, India coordinates
export const defaultLocation = {
  lat: 11.0168,
  lng: 76.9558
};

// Mock restrooms data - in a real app this would come from an API
const mockRestrooms: Restroom[] = [
  {
    id: "1",
    name: "RS Puram Public Restroom",
    description: "Clean public restroom located near RS Puram main area",
    location: {
      lat: 11.0128,
      lng: 76.9502,
      address: "Near RS Puram Main Road",
      city: "Coimbatore",
      state: "Tamil Nadu"
    },
    amenities: ["toilet", "sink", "hand_dryer"],
    cleanliness: {
      score: 85,
      lastUpdated: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      reports: 42
    },
    accessibility: true,
    babyChanging: true,
    genderNeutral: false,
    reviews: [
      {
        id: "r1",
        userId: "u123",
        userName: "LocalUser",
        rating: 4,
        comment: "Very clean for a public restroom. Soap dispensers were full.",
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        cleanliness: 4
      },
      {
        id: "r2",
        userId: "u456",
        userName: "TravelerJ",
        rating: 5,
        comment: "Surprisingly well maintained. No waiting line when I visited.",
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        cleanliness: 5
      }
    ],
    businessInfo: {
      type: "public",
      partnerStatus: "none",
      openHours: "6:00 AM - 10:00 PM"
    }
  },
  {
    id: "2",
    name: "Café Coffee Day - Fun Republic Mall",
    description: "Clean facilities for customers of this popular coffee chain",
    location: {
      lat: 11.0218,
      lng: 76.9613,
      address: "Fun Republic Mall, Avinashi Road",
      city: "Coimbatore",
      state: "Tamil Nadu"
    },
    amenities: ["toilet", "sink", "hand_dryer", "hand_soap", "paper_towels"],
    cleanliness: {
      score: 92,
      lastUpdated: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      reports: 128
    },
    accessibility: true,
    babyChanging: true,
    genderNeutral: true,
    reviews: [
      {
        id: "r3",
        userId: "u789",
        userName: "CoffeeLover",
        rating: 5,
        comment: "Always clean. You need to be a customer but worth buying a coffee for access.",
        date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        cleanliness: 5
      }
    ],
    businessInfo: {
      type: "cafe",
      partnerStatus: "premium",
      openHours: "10:00 AM - 10:00 PM"
    }
  },
  {
    id: "3",
    name: "Coimbatore Railway Station Restrooms",
    description: "Public facilities in the main railway station",
    location: {
      lat: 11.0015,
      lng: 76.9567,
      address: "Railway Station Road",
      city: "Coimbatore",
      state: "Tamil Nadu"
    },
    amenities: ["toilet", "sink", "hand_dryer", "hand_soap"],
    cleanliness: {
      score: 78,
      lastUpdated: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      reports: 256
    },
    accessibility: true,
    babyChanging: true,
    genderNeutral: false,
    reviews: [
      {
        id: "r4",
        userId: "u101",
        userName: "TrainCommuter",
        rating: 3,
        comment: "Clean enough but always crowded during rush hours.",
        date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        cleanliness: 3
      },
      {
        id: "r5",
        userId: "u202",
        userName: "CBEVisitor",
        rating: 4,
        comment: "Well maintained considering how busy this station is.",
        date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        cleanliness: 4
      }
    ],
    businessInfo: {
      type: "public",
      partnerStatus: "none",
      openHours: "24/7"
    }
  },
  {
    id: "4",
    name: "Westin Hotel",
    description: "Luxurious restrooms in the hotel lobby",
    location: {
      lat: 11.0300,
      lng: 76.9540,
      address: "Avinashi Road",
      city: "Coimbatore",
      state: "Tamil Nadu"
    },
    amenities: ["toilet", "sink", "hand_dryer", "hand_soap", "lotion", "mouthwash"],
    cleanliness: {
      score: 96,
      lastUpdated: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
      reports: 68
    },
    accessibility: true,
    babyChanging: true,
    genderNeutral: true,
    reviews: [
      {
        id: "r6",
        userId: "u303",
        userName: "LuxeTraveler",
        rating: 5,
        comment: "Immaculately clean. The lobby restrooms are accessible without being a guest.",
        date: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
        cleanliness: 5
      }
    ],
    businessInfo: {
      type: "hotel",
      partnerStatus: "premium",
      openHours: "24/7"
    }
  },
  {
    id: "5",
    name: "VOC Park Public Restroom",
    description: "Public restroom near the popular city park",
    location: {
      lat: 11.0058,
      lng: 76.9725,
      address: "VOC Park Road",
      city: "Coimbatore",
      state: "Tamil Nadu"
    },
    amenities: ["toilet", "sink", "hand_dryer", "hand_soap"],
    cleanliness: {
      score: 82,
      lastUpdated: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      reports: 95
    },
    accessibility: true,
    babyChanging: true,
    genderNeutral: false,
    reviews: [
      {
        id: "r7",
        userId: "u404",
        userName: "ParkVisitor",
        rating: 4,
        comment: "Well maintained public restroom. Usually clean.",
        date: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
        cleanliness: 4
      },
      {
        id: "r8",
        userId: "u505",
        userName: "CBExplorer",
        rating: 4,
        comment: "Decent facilities. Sometimes there's a short wait.",
        date: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
        cleanliness: 4
      }
    ],
    businessInfo: {
      type: "public",
      partnerStatus: "standard",
      openHours: "6:00 AM - 9:00 PM"
    }
  }
];

export const getRestroomsByLocation = (lat: number, lng: number, radius: number = 5): Restroom[] => {
  // Simple distance calculation (not accounting for Earth's curvature)
  // For a real app, use proper geospatial queries
  return mockRestrooms.filter(restroom => {
    const distance = Math.sqrt(
      Math.pow(restroom.location.lat - lat, 2) + 
      Math.pow(restroom.location.lng - lng, 2)
    );
    
    // Convert rough degrees to kilometers (very approximate)
    const distanceInKm = distance * 111;
    
    return distanceInKm <= radius;
  });
};

export const getRestroomById = (id: string): Restroom | undefined => {
  return mockRestrooms.find(restroom => restroom.id === id);
};

export const getAllRestrooms = (): Restroom[] => {
  return [...mockRestrooms];
};

export const getCleanlinessTier = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 85) return 'high';
  if (score >= 70) return 'medium';
  return 'low';
};
