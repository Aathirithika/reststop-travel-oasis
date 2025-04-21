
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

interface ChatbotProps {
  onFindNearbyRestrooms: (query: string) => void;
}

export function Chatbot({ onFindNearbyRestrooms }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello! I'm your RestStop assistant. How can I help you find restrooms today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [currentLocation, setCurrentLocation] = useState(defaultLocation);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  
  // Speech recognition setup
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
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
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        // Auto send voice message
        setTimeout(() => {
          handleSendMessage(transcript);
          setIsListening(false);
        }, 500);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error("Voice recognition error. Please try again.");
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
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

  const processUserQuery = async (query: string) => {
    // Normalize the query for better matching
    const normalizedQuery = query.toLowerCase();
    let botResponse = "";
    
    // Get all available restrooms
    const allRestrooms = [...getAllRestrooms(), ...getUserRestrooms()];
    let nearbyRestrooms: any[] = [];
    
    if (hasLocationPermission) {
      nearbyRestrooms = [
        ...getRestroomsByLocation(currentLocation.lat, currentLocation.lng, 2),
        ...getNearbyRestrooms(currentLocation.lat, currentLocation.lng, 2)
      ];
    }
    
    // Check different types of queries
    if (normalizedQuery.includes("restroom") || 
        normalizedQuery.includes("bathroom") || 
        normalizedQuery.includes("toilet")) {
      
      if (nearbyRestrooms.length > 0) {
        const count = nearbyRestrooms.length;
        const closest = nearbyRestrooms[0];
        const cleanlinessRating = getCleanlinessTier(closest.cleanliness.score);
        const cleanlinessText = cleanlinessRating === 'high' ? "highly rated" : 
                                cleanlinessRating === 'medium' ? "moderately rated" : "lower rated";
        
        botResponse = `I found ${count} restrooms near you. The closest is ${closest.name}, which is ${cleanlinessText} for cleanliness. Would you like to see them on the map?`;
        onFindNearbyRestrooms(query);
      } else if (!hasLocationPermission) {
        botResponse = "I'd like to find restrooms near you, but I need permission to access your location. Please enable location services and try again.";
      } else {
        botResponse = "I couldn't find any restrooms in your immediate vicinity. Would you like me to expand the search radius?";
      }
    } else if (normalizedQuery.includes("clean") || normalizedQuery.includes("hygienic")) {
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
          botResponse = `I found ${nearbyCleanRestrooms.length} highly-rated clean restrooms near you. The top rated is ${nearbyCleanRestrooms[0].name} with a cleanliness score of ${nearbyCleanRestrooms[0].cleanliness.score}/100. Would you like me to show them on the map?`;
          onFindNearbyRestrooms("clean restrooms");
        } else {
          botResponse = "I couldn't find any highly-rated clean restrooms in your immediate vicinity. Would you like me to expand the search radius?";
        }
      } else {
        botResponse = "I can help you find clean restrooms, but I need your location to provide the best results. Please enable location services.";
      }
    } else if (normalizedQuery.includes("accessible") || normalizedQuery.includes("disability")) {
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
          botResponse = `I found ${nearbyAccessible.length} accessible restrooms near you. Would you like me to show them on the map?`;
          onFindNearbyRestrooms("accessible");
        } else {
          botResponse = "I couldn't find any accessible restrooms in your immediate vicinity. Would you like me to expand the search radius?";
        }
      } else {
        botResponse = "I can help you find accessible restrooms, but I need your location to provide the best results. Please enable location services.";
      }
    } else if (normalizedQuery.includes("baby") || normalizedQuery.includes("changing")) {
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
          botResponse = `I found ${nearbyBabyChanging.length} restrooms with baby changing facilities near you. Would you like me to show them on the map?`;
          onFindNearbyRestrooms("baby changing");
        } else {
          botResponse = "I couldn't find any restrooms with baby changing facilities in your immediate vicinity. Would you like me to expand the search radius?";
        }
      } else {
        botResponse = "I can help you find restrooms with baby changing facilities, but I need your location to provide the best results.";
      }
    } else if (normalizedQuery.includes("gender") || normalizedQuery.includes("neutral")) {
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
          botResponse = `I found ${nearbyGenderNeutral.length} gender-neutral restrooms near you. Would you like me to show them on the map?`;
          onFindNearbyRestrooms("gender neutral");
        } else {
          botResponse = "I couldn't find any gender-neutral restrooms in your immediate vicinity. Would you like me to expand the search radius?";
        }
      } else {
        botResponse = "I can help you find gender-neutral restrooms, but I need your location to provide the best results.";
      }
    } else if (normalizedQuery.includes("help")) {
      botResponse = "You can ask me to find restrooms near you, get information about specific features like cleanliness ratings, accessibility, baby changing facilities, or gender-neutral options. I can also help you navigate to the nearest restroom. What would you like to know?";
    } else if (normalizedQuery.includes("location") || normalizedQuery.includes("where am i")) {
      if (hasLocationPermission) {
        botResponse = `You're currently located at approximately latitude ${currentLocation.lat.toFixed(4)} and longitude ${currentLocation.lng.toFixed(4)}. This appears to be in the Coimbatore area. I can help find restrooms near this location.`;
      } else {
        botResponse = "I don't currently have access to your location. Please enable location services so I can provide better assistance.";
      }
    } else {
      botResponse = "I'm here to help you find and locate restrooms. You can ask about nearby restrooms, clean facilities, accessible options, baby changing stations, or gender-neutral bathrooms. How can I assist you today?";
    }
    
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        content: botResponse,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // If text-to-speech is available, speak the response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse);
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);
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
            <div className="font-semibold">RestStop Assistant</div>
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
