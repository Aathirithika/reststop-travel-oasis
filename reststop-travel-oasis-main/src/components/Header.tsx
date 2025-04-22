
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Bell, UserCircle, Sun, Moon, Star, Store, ArrowLeft } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {!isHome && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Link to="/">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-reststop-primary" />
              <h1 className="text-xl font-bold text-reststop-primary">RestStop</h1>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/recommendations" className="text-sm hover:text-reststop-primary">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Star className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/partnerships" className="text-sm hover:text-reststop-primary">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Store className="h-5 w-5" />
              </Button>
            </Link>
          </nav>
        </div>
        
        <form onSubmit={handleSubmit} className="hidden md:flex flex-1 items-center justify-center px-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for restrooms nearby..."
              className="w-full pl-8 rounded-full bg-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="ml-2">Search</Button>
        </form>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate('/profile')}
          >
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile search */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search restrooms..."
              className="w-full pl-8 rounded-full bg-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>
    </header>
  );
}
