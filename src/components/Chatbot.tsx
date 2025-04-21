import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send, X, Mic, MicOff } from "lucide-react";
import { ChatMessage } from "@/types";
import { getAllRestrooms, getRestroomsByLocation, getCleanlinessTier, defaultLocation } from "@/data/restrooms";
import { getNearbyRestrooms, getUserRestrooms } from "@/data/userRestrooms";
import { toast } from "sonner";
import { Map as MapIcon } from "lucide-react"; // Add map icon for navigation button

// Define SpeechRecognition interface for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInterface extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
}

// Add global declarations for browser compatibility
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInterface;
    webkitSpeechRecognition?: new () => SpeechRecognitionInterface;
  }
}

interface ChatbotProps {
  onFindNearbyRestrooms: (query: string) => void;
}

export function Chatbot({ onFindNearbyRestrooms }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello! I'm your RestStop assistant for Coimbatore district. I can help you find restrooms across the entire district, including areas like Vadavalli, Saibaba Colony, Ganapathy and many more locations. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [currentLocation, setCurrentLocation] = useState(defaultLocation);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [showMapFromBot, setShowMapFromBot] = useState(false);
  const [pendingMapQuery, setPendingMapQuery] = useState<string | null>(null);
  
  // Speech recognition setup
  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);
  
  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setHasLocationPermission(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Location access denied. Some features may be limited.");
        }
      );
    }
    
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        recognitionRef.current = new SpeechRecognitionConstructor();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
          // Auto send voice message
          setTimeout(() => {
            handleSendMessage(transcript);
            setIsListening(false);
          }, 500);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event);
          setIsListening(false);
          toast.error("Voice recognition error. Please try again.");
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (inputMessage: string = message) => {
    if (!inputMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    
    // Process the query based on our dataset
    processUserQuery(inputMessage);
  };

  // Helper for bot responses to append navigation
  const appendNavigateToMapButton = (response: string, query: string) => {
    return {
      type: "bot",
      content: response,
      navigateQuery: query
    } as any; // Add a special property to be rendered as navigation option.
  };

  // MARKER: Replace previous usage of botResponse for restroom and area queries to now include a "Navigate" button
  const processUserQuery = async (query: string) => {
    // Normalize the query for better matching
    const normalizedQuery = query.toLowerCase();
    let botResponse: string | undefined = undefined;
    let addNavigate = false;
    let navigateQuery: string = "";

    // Get all available restrooms
    const allRestrooms = [...getAllRestrooms(), ...getUserRestrooms()];
    let nearbyRestrooms: any[] = [];
    
    if (hasLocationPermission) {
      nearbyRestrooms = [
        ...getRestroomsByLocation(currentLocation.lat, currentLocation.lng, 2),
        ...getNearbyRestrooms(currentLocation.lat, currentLocation.lng, 2)
      ];
    }
    
    // When the user asks about any restroom or a specific area, offer navigation
    if (
      normalizedQuery.includes("vadavalli") ||
      normalizedQuery.includes("fuel station vadavalli")
    ) {
      const vadavalliRestrooms = allRestrooms.filter(r => 
        r.name.toLowerCase().includes("vadavalli") || 
        (r.location.address && r.location.address.toLowerCase().includes("vadavalli"))
      );
      if (vadavalliRestrooms.length > 0) {
        const topRated = vadavalliRestrooms.sort((a, b) => b.cleanliness.score - a.cleanliness.score)[0];
        botResponse = `I found ${vadavalliRestrooms.length} restrooms in Vadavalli area of Coimbatore. The top rated is ${topRated.name} with a cleanliness score of ${topRated.cleanliness.score}/100.`;
        addNavigate = true;
        navigateQuery = "vadavalli";
      } else {
        botResponse = "I couldn't find specific restrooms in Vadavalli in our database. Would you like me to show all restrooms across Coimbatore district instead?";
      }
    } else if (
      normalizedQuery.includes("saibaba colony") ||
      normalizedQuery.includes("fuel station saibaba")
    ) {
      const saibabaRestrooms = allRestrooms.filter(r => 
        r.name.toLowerCase().includes("saibaba") || 
        (r.location.address && r.location.address.toLowerCase().includes("saibaba"))
      );
      if (saibabaRestrooms.length > 0) {
        const firstResult = saibabaRestrooms[0];
        const cleanlinessRating = getCleanlinessTier(firstResult.cleanliness.score);
        botResponse = `I found a ${cleanlinessRating === 'high' ? "highly rated" : cleanlinessRating === 'medium' ? "moderately rated" : "lower rated"} restroom at ${firstResult.name} in Saibaba Colony, Coimbatore. Note that this location has been reported as ${firstResult.cleanliness.score < 70 ? "not very clean" : "clean"}.`;
        addNavigate = true;
        navigateQuery = "saibaba colony";
      } else {
        botResponse = "I don't have specific information about restrooms in Saibaba Colony yet. Would you like to see other options across Coimbatore district?";
      }
    } else if (normalizedQuery.includes("ganapathy") || normalizedQuery.includes("fuel station ganapathy")) {
      const ganapathyRestrooms = allRestrooms.filter(r => 
        r.name.toLowerCase().includes("ganapathy") || 
        (r.location.address && r.location.address.toLowerCase().includes("ganapathy"))
      );
      if (ganapathyRestrooms.length > 0) {
        botResponse = `I found a highly-rated restroom at ${ganapathyRestrooms[0].name} in Ganapathy, Coimbatore with excellent cleanliness ratings.`;
        addNavigate = true;
        navigateQuery = "ganapathy";
      } else {
        botResponse = "I don't have specific information about restrooms in Ganapathy yet. Would you like to see other options in Coimbatore district?";
      }
    } else if (normalizedQuery.includes("coimbatore") || normalizedQuery.includes("district")) {
      if (nearbyRestrooms.length > 0) {
        botResponse = `I found ${nearbyRestrooms.length} restrooms in Coimbatore district near your current location.`;
        addNavigate = true;
        navigateQuery = "coimbatore";
      } else {
        const totalRestrooms = allRestrooms.length;
        botResponse = `Our database has information on ${totalRestrooms} restrooms across Coimbatore district. Could you specify a particular area or let me access your location to find the nearest ones?`;
      }
    } else if (
      normalizedQuery.includes("restroom") || 
      normalizedQuery.includes("bathroom") || 
      normalizedQuery.includes("toilet")
    ) {
      if (nearbyRestrooms.length > 0) {
        const count = nearbyRestrooms.length;
        const closest = nearbyRestrooms[0];
        const cleanlinessRating = getCleanlinessTier(closest.cleanliness.score);
        const cleanlinessText = cleanlinessRating === 'high' ? "highly rated" : 
                                cleanlinessRating === 'medium' ? "moderately rated" : "lower rated";
        botResponse = `I found ${count} restrooms near you in Coimbatore district. The closest is ${closest.name}, which is ${cleanlinessText} for cleanliness.`;
        addNavigate = true;
        navigateQuery = query;
      } else if (!hasLocationPermission) {
        botResponse = "I'd like to find restrooms near you in Coimbatore district, but I need permission to access your location. Please enable location services and try again.";
      } else {
        botResponse = "I couldn't find any restrooms in your immediate vicinity in Coimbatore district. Would you like me to expand the search radius?";
      }
    } else if (
      normalizedQuery.includes("clean") || normalizedQuery.includes("hygienic")
    ) {
      const cleanRestrooms = allRestrooms.filter(r => r.cleanliness.score >= 85);
      if (hasLocationPermission && cleanRestrooms.length > 0) {
        const nearbyCleanRestrooms = cleanRestrooms.filter(r => {
          const distance = Math.sqrt(
            Math.pow(r.location.lat - currentLocation.lat, 2) + 
            Math.pow(r.location.lng - currentLocation.lng, 2)
          ) * 111; // rough conversion to km
          return distance <= 3;
        });
        if (nearbyCleanRestrooms.length > 0) {
          botResponse = `I found ${nearbyCleanRestrooms.length} highly-rated clean restrooms near you in Coimbatore district. The top rated is ${nearbyCleanRestrooms[0].name} with a cleanliness score of ${nearbyCleanRestrooms[0].cleanliness.score}/100.`;
          addNavigate = true;
          navigateQuery = "clean restrooms";
        } else {
          botResponse = "I couldn't find any highly-rated clean restrooms in your immediate vicinity in Coimbatore district. Would you like me to expand the search radius?";
        }
      } else {
        botResponse = "I can help you find clean restrooms in Coimbatore district, but I need your location to provide the best results. Please enable location services.";
      }
    } else if (
      normalizedQuery.includes("fuel") ||
      normalizedQuery.includes("petrol") ||
      normalizedQuery.includes("gas station")
    ) {
      const fuelStationRestrooms = allRestrooms.filter(r => 
        r.businessInfo.type === "gas_station" || 
        r.name.toLowerCase().includes("fuel")
      );
      if (fuelStationRestrooms.length > 0) {
        const cleanFuelStations = fuelStationRestrooms.filter(r => r.cleanliness.score >= 80);
        if (cleanFuelStations.length > 0) {
          botResponse = `I found ${cleanFuelStations.length} clean restrooms at fuel stations across Coimbatore district. The best ones are at ${cleanFuelStations[0].name} and ${cleanFuelStations.length > 1 ? cleanFuelStations[1].name : "other locations"}.`;
          addNavigate = true;
          navigateQuery = "fuel station";
        } else {
          botResponse = `I found ${fuelStationRestrooms.length} restrooms at fuel stations in Coimbatore district, but their cleanliness ratings vary. The highest rated is at ${fuelStationRestrooms.sort((a, b) => b.cleanliness.score - a.cleanliness.score)[0].name}.`;
          addNavigate = true;
          navigateQuery = "fuel station";
        }
      } else {
        botResponse = "I don't have specific information about fuel station restrooms in our database yet. Would you like to see other restroom options in Coimbatore district?";
      }
    } else if (
      normalizedQuery.includes("accessible") || normalizedQuery.includes("disability")
    ) {
      const accessibleRestrooms = allRestrooms.filter(r => r.accessibility);
      if (hasLocationPermission && accessibleRestrooms.length > 0) {
        const nearbyAccessible = accessibleRestrooms.filter(r => {
          const distance = Math.sqrt(
            Math.pow(r.location.lat - currentLocation.lat, 2) + 
            Math.pow(r.location.lng - currentLocation.lng, 2)
          ) * 111;
          return distance <= 3;
        });
        if (nearbyAccessible.length > 0) {
          botResponse = `I found ${nearbyAccessible.length} accessible restrooms near you in Coimbatore district.`;
          addNavigate = true;
          navigateQuery = "accessible";
        } else {
          botResponse = "I couldn't find any accessible restrooms in your immediate vicinity in Coimbatore district. Would you like me to expand the search radius?";
        }
      } else {
        botResponse = "I can help you find accessible restrooms in Coimbatore district, but I need your location to provide the best results. Please enable location services.";
      }
    } else if (
      normalizedQuery.includes("baby") || normalizedQuery.includes("changing")
    ) {
      const babyChangingRestrooms = allRestrooms.filter(r => r.babyChanging);
      if (hasLocationPermission && babyChangingRestrooms.length > 0) {
        const nearbyBabyChanging = babyChangingRestrooms.filter(r => {
          const distance = Math.sqrt(
            Math.pow(r.location.lat - currentLocation.lat, 2) + 
            Math.pow(r.location.lng - currentLocation.lng, 2)
          ) * 111;
          return distance <= 3;
        });
        if (nearbyBabyChanging.length > 0) {
          botResponse = `I found ${nearbyBabyChanging.length} restrooms with baby changing facilities near you in Coimbatore district.`;
          addNavigate = true;
          navigateQuery = "baby changing";
        } else {
          botResponse = "I couldn't find any restrooms with baby changing facilities in your immediate vicinity in Coimbatore district. Would you like me to expand the search radius?";
        }
      } else {
        botResponse = "I can help you find restrooms with baby changing facilities in Coimbatore district, but I need your location to provide the best results.";
      }
    } else if (
      normalizedQuery.includes("gender") || normalizedQuery.includes("neutral")
    ) {
      const genderNeutralRestrooms = allRestrooms.filter(r => r.genderNeutral);
      if (hasLocationPermission && genderNeutralRestrooms.length > 0) {
        const nearbyGenderNeutral = genderNeutralRestrooms.filter(r => {
          const distance = Math.sqrt(
            Math.pow(r.location.lat - currentLocation.lat, 2) + 
            Math.pow(r.location.lng - currentLocation.lng, 2)
          ) * 111;
          return distance <= 3;
        });
        if (nearbyGenderNeutral.length > 0) {
          botResponse = `I found ${nearbyGenderNeutral.length} gender-neutral restrooms near you in Coimbatore district.`;
          addNavigate = true;
          navigateQuery = "gender neutral";
        } else {
          botResponse = "I couldn't find any gender-neutral restrooms in your immediate vicinity in Coimbatore district. Would you like me to expand the search radius?";
        }
      } else {
        botResponse = "I can help you find gender-neutral restrooms in Coimbatore district, but I need your location to provide the best results.";
      }
    } else if (normalizedQuery.includes("help")) {
      botResponse = "You can ask me to find restrooms anywhere in Coimbatore district, including specific areas like Vadavalli, Saibaba Colony, or Ganapathy. I can provide information about cleanliness ratings, accessibility, baby changing facilities, or gender-neutral options. I can also help you find restrooms at fuel stations. What would you like to know?";
    } else if (normalizedQuery.includes("location") || normalizedQuery.includes("where am i")) {
      if (hasLocationPermission) {
        botResponse = `You're currently located at approximately latitude ${currentLocation.lat.toFixed(4)} and longitude ${currentLocation.lng.toFixed(4)}. This appears to be in the Coimbatore district area. I can help find restrooms near this location.`;
      } else {
        botResponse = "I don't currently have access to your location. Please enable location services so I can provide better assistance in finding restrooms in Coimbatore district.";
      }
    } else if (normalizedQuery.includes("areas") || normalizedQuery.includes("locations") || normalizedQuery.includes("places")) {
      botResponse = "I have information about restrooms in various areas of Coimbatore district including Vadavalli, Saibaba Colony, Ganapathy, Podanur, Saravanampatti, Thudiyalur, Sulur, and many other locations. Which area are you interested in?";
    } else {
      botResponse = "I'm here to help you find and locate restrooms across the entire Coimbatore district. You can ask about specific areas like Vadavalli, Saibaba Colony, or Ganapathy, or ask about nearby restrooms, clean facilities, accessible options, baby changing stations, or gender-neutral bathrooms. How can I assist you today?";
    }

    // Update messages with or without navigation
    setTimeout(() => {
      if (botResponse && addNavigate) {
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            content: botResponse,
            sender: "bot",
            timestamp: new Date().toISOString(),
            navigateQuery // custom property for rendering button
          } as ChatMessage
        ]);
      } else {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          content: botResponse || "",
          sender: "bot",
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, botMessage]);
      }

      // Text to speech
      if (botResponse && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse);
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);
  };

  // New handler for the "Navigate to Map" button
  const handleNavigateToMap = (query: string) => {
    onFindNearbyRestrooms(query);
    setIsOpen(false); // Minimize chat
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        toast.error("Speech recognition is not supported in your browser.");
        return;
      }
      
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info("Listening... Speak now.");
      } catch (error) {
        console.error("Speech recognition error:", error);
        toast.error("Could not start speech recognition. Please try again.");
        setIsListening(false);
      }
    }
  };

  return (
    <>
      {!isOpen && (
        <Button 
          className="fixed bottom-4 right-4 rounded-full w-14 h-14 p-0 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare size={24} />
        </Button>
      )}
      
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 md:w-96 h-96 shadow-xl flex flex-col animate-fade-in">
          <div className="flex items-center justify-between bg-primary text-white p-3 rounded-t-lg">
            <div className="font-semibold">RestStop Assistant - Coimbatore District</div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-primary/80">
              <X size={18} />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === "user" 
                        ? "bg-primary text-white" 
                        : "bg-muted"
                    }`}
                  >
                    {msg.content}
                    {/* Show "Navigate to Map" if navigateQuery is defined */}
                    {msg.navigateQuery && (
                      <div className="mt-2 flex justify-end">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 shadow"
                          onClick={() => handleNavigateToMap(msg.navigateQuery as string)}
                        >
                          <MapIcon size={16} className="mr-1" />
                          Navigate to Map
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <CardContent className="border-t p-3">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder={isListening ? "Listening..." : "Type your message..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`flex-1 ${isListening ? 'border-primary' : ''}`}
                disabled={isListening}
              />
              <Button 
                type="button" 
                size="icon" 
                variant={isListening ? "destructive" : "ghost"}
                onClick={toggleListening}
                className={isListening ? "animate-pulse" : ""}
              >
                {isListening ? (
                  <MicOff size={18} />
                ) : (
                  <Mic size={18} />
                )}
              </Button>
              <Button type="submit" size="icon" disabled={isListening}>
                <Send size={18} />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
