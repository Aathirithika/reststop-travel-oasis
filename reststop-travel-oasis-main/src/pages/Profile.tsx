
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Settings, LogOut, Star, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  return (
    <div className="container max-w-md mx-auto py-6 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <div className="bg-reststop-primary text-white rounded-full h-full w-full flex items-center justify-center text-2xl font-semibold">
              US
            </div>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">User</h2>
            <p className="text-muted-foreground">user@example.com</p>
          </div>
        </div>
        
        <div className="flex justify-between text-center mb-4">
          <div>
            <p className="text-xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Reviews</p>
          </div>
          <div>
            <p className="text-xl font-bold">23</p>
            <p className="text-sm text-muted-foreground">Reports</p>
          </div>
          <div>
            <p className="text-xl font-bold">450</p>
            <p className="text-sm text-muted-foreground">Points</p>
          </div>
        </div>

        <Button className="w-full">Edit Profile</Button>
      </Card>

      <Card className="p-4 mb-6">
        <h3 className="font-medium mb-3">Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Star className="text-yellow-500" />
            <div>
              <p className="font-medium">Reviewed Café Coffee Day</p>
              <p className="text-sm text-muted-foreground">2 days ago</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" />
            <div>
              <p className="font-medium">Reported cleanliness at Railway Station</p>
              <p className="text-sm text-muted-foreground">1 week ago</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Clock className="text-blue-500" />
            <div>
              <p className="font-medium">Updated VOC Park restroom hours</p>
              <p className="text-sm text-muted-foreground">2 weeks ago</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <Button variant="outline" className="w-full flex justify-between">
          <span>Settings</span>
          <Settings size={18} />
        </Button>
        <Button variant="outline" className="w-full flex justify-between text-red-500 hover:text-red-600">
          <span>Log Out</span>
          <LogOut size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Profile;
