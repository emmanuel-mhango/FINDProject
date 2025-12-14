
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

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
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-find-red font-medium">Home</Link>
          <Link to="/jobs" className="text-gray-700 hover:text-find-red font-medium">Jobs</Link>
          <Link to="/roommates" className="text-gray-700 hover:text-find-red font-medium">Roommates</Link>
          <Link to="/about" className="text-gray-700 hover:text-find-red font-medium">About</Link>
        </nav>
        
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
