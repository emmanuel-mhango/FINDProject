
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, Menu, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    // Check if user data exists in localStorage
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(savedUserData));
    }
  }, []);
  
  return (
    <header className="bg-white py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-find-red flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <Link to="/" className="find-logo text-2xl font-bold tracking-tight">FIND</Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-find-red font-medium">Home</Link>
          <Link to="/jobs" className="text-gray-700 hover:text-find-red font-medium">Jobs</Link>
          <Link to="/roommates" className="text-gray-700 hover:text-find-red font-medium">Roommates</Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-gray-700 hover:text-find-red font-medium flex items-center">
                More <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/about" className="w-full">About Us</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/team" className="w-full">Meet Our Team</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/faq" className="w-full">FAQ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/feedback" className="w-full">Feedback</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="text-gray-700 hover:text-find-red font-medium py-2">Home</Link>
                <Link to="/jobs" className="text-gray-700 hover:text-find-red font-medium py-2">Jobs</Link>
                <Link to="/roommates" className="text-gray-700 hover:text-find-red font-medium py-2">Roommates</Link>
                
                <div className="border-t pt-4">
                  <p className="text-gray-500 text-sm font-medium mb-2">More</p>
                  <Link to="/about" className="text-gray-700 hover:text-find-red font-medium py-2 block">About Us</Link>
                  <Link to="/team" className="text-gray-700 hover:text-find-red font-medium py-2 block">Meet Our Team</Link>
                  <Link to="/faq" className="text-gray-700 hover:text-find-red font-medium py-2 block">FAQ</Link>
                  <Link to="/feedback" className="text-gray-700 hover:text-find-red font-medium py-2 block">Feedback</Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        {isLoggedIn ? (
          <Button variant="outline" className="border-find-red text-find-red hover:bg-find-red hover:text-white rounded-full px-6" asChild>
            <Link to="/profile">
              <User size={18} className="mr-2" />
              My Profile
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="border-find-red text-find-red hover:bg-find-red hover:text-white rounded-full px-6" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
