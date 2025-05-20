
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";

const Header = () => {
  const { remainingFreePosts, isSubscribed, user, signOut } = useAppContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="w-full py-4 px-4 md:px-8 border-b bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-postcraft-primary">PostCraft</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-postcraft-primary font-medium">
            Home
          </Link>
          <Link to="/create" className="text-gray-700 hover:text-postcraft-primary font-medium">
            Create Post
          </Link>
          <Link to="/settings" className="text-gray-700 hover:text-postcraft-primary font-medium">
            Settings
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {!isSubscribed && (
                <div className="hidden md:block text-sm text-gray-600">
                  <span className="font-medium">Free Posts: </span>
                  <span className="font-bold">{remainingFreePosts}</span>
                </div>
              )}
              
              {!isSubscribed && (
                <Link to="/pricing">
                  <Button variant="default" className="bg-postcraft-primary hover:bg-postcraft-accent">
                    Subscribe
                  </Button>
                </Link>
              )}
              
              {isSubscribed && (
                <div className="hidden md:flex items-center">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                    Premium
                  </span>
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="default" className="bg-postcraft-primary hover:bg-postcraft-accent">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
