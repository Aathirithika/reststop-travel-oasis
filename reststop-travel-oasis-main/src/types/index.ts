
export interface Restroom {
  id: string;
  name: string;
  description?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
  };
  amenities: string[];
  cleanliness: {
    score: number; // 0-100
    lastUpdated: string; // ISO date string
    reports: number;
  };
  accessibility: boolean;
  babyChanging: boolean;
  genderNeutral: boolean;
  reviews: Review[];
  businessInfo?: {
    type: 'gas_station' | 'cafe' | 'restaurant' | 'hotel' | 'bakery' | 'public' | 'other';
    partnerStatus?: 'premium' | 'standard' | 'none';
    openHours?: string;
  };
  isNearby?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment?: string;
  date: string; // ISO date string
  cleanliness: number; // 1-5
  images?: string[]; // URLs to images
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  navigateQuery?: string; // Added for navigation feature
}

export interface Notification {
  id: string;
  type: 'alert' | 'location' | 'review' | 'reminder';
  title: string;
  message: string;
  time: string;
  read: boolean;
  relatedId?: string;
}
