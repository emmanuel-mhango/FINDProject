
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Check if user data exists in localStorage
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(savedUserData));
    }
  }, []);
  
  return (
    <header className="glass-surface py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-glow">
            <div className="w-4 h-4 bg-primary-foreground rounded-full"></div>
          </div>
          <Link to="/" className="find-logo text-2xl font-bold tracking-tight">FIND</Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-foreground/80 hover:text-primary font-medium transition-colors duration-300">Home</Link>
          <Link to="/jobs" className="text-foreground/80 hover:text-primary font-medium transition-colors duration-300">Jobs</Link>
          <Link to="/roommates" className="text-foreground/80 hover:text-primary font-medium transition-colors duration-300">Roommates</Link>
          <Link to="/taxi" className="text-foreground/80 hover:text-primary font-medium transition-colors duration-300">Taxi</Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Auth Button */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <Button 
              className="btn-glow bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl px-6 shadow-lg hover:shadow-xl transition-all duration-300" 
              asChild
            >
              <Link to="/profile">
                <User size={18} className="mr-2" />
                My Profile
              </Link>
            </Button>
          ) : (
            <Button 
              className="btn-glow bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl px-6 shadow-lg hover:shadow-xl transition-all duration-300" 
              asChild
            >
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-surface border-t border-border/50 animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-primary font-medium transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/jobs" 
              className="text-foreground/80 hover:text-primary font-medium transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link 
              to="/roommates" 
              className="text-foreground/80 hover:text-primary font-medium transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Roommates
            </Link>
            <Link 
              to="/taxi" 
              className="text-foreground/80 hover:text-primary font-medium transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Taxi
            </Link>
            <div className="pt-2 border-t border-border/50">
              {isLoggedIn ? (
                <Button className="w-full btn-glow bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl" asChild>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={18} className="mr-2" />
                    My Profile
                  </Link>
                </Button>
              ) : (
                <Button className="w-full btn-glow bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl" asChild>
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
