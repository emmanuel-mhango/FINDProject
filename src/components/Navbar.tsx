import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Menu, X, LogOut } from 'lucide-react';
import { isAdminLoggedIn } from '@/lib/adminAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = isAdminLoggedIn();
  
  useEffect(() => {
    // Check if user data exists in localStorage
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(savedUserData));
    }
  }, []);
  
  const isActive = (path: string) => location.pathname === path;

  const menuItems = isAdmin
    ? [
        { path: '/admin', label: 'Overview' },
        { path: '/admin?tab=homes', label: 'Homes' },
        { path: '/admin?tab=taxis', label: 'Taxis' },
        { path: '/admin?tab=jobs', label: 'Jobs' },
        { path: '/admin?tab=employers', label: 'Employers' },
      ]
    : [];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 rounded-full bg-find-red flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-2xl font-bold text-find-red hidden sm:inline">FIND</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-find-red border-b-2 border-find-red pb-1'
                    : 'text-gray-700 hover:text-find-red'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin ? (
              <Button
                className="bg-find-red hover:bg-red-700 text-white"
                onClick={() => navigate('/admin')}
              >
                Admin Dashboard
              </Button>
            ) : isLoggedIn ? (
              <>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => navigate('/profile')}
                >
                  <User size={18} />
                  Profile
                </Button>
                <Button
                  className="bg-find-red hover:bg-red-700 text-white"
                  onClick={() => {
                    localStorage.removeItem('userData');
                    navigate('/');
                  }}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/signin')}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-find-red hover:bg-red-700 text-white"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
          {isOpen && (
          <div className="md:hidden pb-6 space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`block w-full text-left py-2 font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-find-red'
                    : 'text-gray-700 hover:text-find-red'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 border-t border-gray-200 space-y-2">
              {isAdmin ? (
                <Button
                  className="w-full bg-find-red hover:bg-red-700 text-white justify-start"
                  onClick={() => {
                    navigate('/admin');
                    setIsOpen(false);
                  }}
                >
                  Admin Dashboard
                </Button>
              ) : isLoggedIn ? (
                <>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => {
                      navigate('/profile');
                      setIsOpen(false);
                    }}
                  >
                    <User size={18} className="mr-2" />
                    Profile
                  </Button>
                  <Button
                    className="w-full bg-find-red hover:bg-red-700 text-white justify-start"
                    onClick={() => {
                      localStorage.removeItem('userData');
                      navigate('/');
                      setIsOpen(false);
                    }}
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => {
                      navigate('/signin');
                      setIsOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full bg-find-red hover:bg-red-700 text-white justify-start"
                    onClick={() => {
                      navigate('/register');
                      setIsOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
