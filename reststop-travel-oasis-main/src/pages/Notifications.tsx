
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, MapPin, Star, AlertCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import { Notification } from "@/types";

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "alert",
      title: "Temporary closure",
      message: "RS Puram Public Restroom will be closed for maintenance tomorrow",
      time: "10 minutes ago",
      read: false
    },
    {
      id: "2",
      type: "location",
      title: "New restroom nearby",
      message: "A new premium restroom has been added at Brookefields Mall",
      time: "2 hours ago",
      read: false
    },
    {
      id: "3",
      type: "review",
      title: "Review reminder",
      message: "How was your experience at Westin Hotel restroom?",
      time: "1 day ago",
      read: true,
      relatedId: "westin-123"
    },
    {
      id: "4",
      type: "alert",
      title: "Cleanliness alert",
      message: "VOC Park Public Restroom reported as needing cleaning",
      time: "2 days ago",
      read: false
    },
    {
      id: "5",
      type: "alert",
      title: "No restroom nearby",
      message: "There are no restrooms within 2km of your current location",
      time: "30 minutes ago",
      read: false
    },
    {
      id: "6", 
      type: "reminder",
      title: "Review reminder",
      message: "Please leave a review for the last restroom you visited",
      time: "5 hours ago",
      read: false,
      relatedId: "last-visited-123"
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle size={20} className="text-red-500" />;
      case "location":
        return <MapPin size={20} className="text-blue-500" />;
      case "review":
        return <Star size={20} className="text-yellow-500" />;
      case "reminder":
        return <Clock size={20} className="text-purple-500" />;
      default:
        return <Bell size={20} />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
    toast.success("All notifications marked as read");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container max-w-md mx-auto py-6 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {notifications.length > 0 ? (
        <Card className="divide-y">
          {notifications.map((notification) => (
            <div key={notification.id} className={`p-4 ${!notification.read ? 'bg-muted/30' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div>
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg">No notifications yet</h3>
          <p className="text-muted-foreground">When you receive notifications, they'll appear here</p>
        </div>
      )}
      
      <div className="mt-6">
        <Button variant="outline" className="w-full" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>
    </div>
  );
};

export default Notifications;
