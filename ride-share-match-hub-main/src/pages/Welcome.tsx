
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from "@/components/ui/sonner";

const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    // Get the name from URL query parameters
    const params = new URLSearchParams(location.search);
    const nameParam = params.get('name');
    
    // If name is not in URL, try to get from localStorage
    if (nameParam) {
      setUserName(nameParam);
    } else {
      const storedDetails = localStorage.getItem('userDetails');
      if (storedDetails) {
        const userDetails = JSON.parse(storedDetails);
        setUserName(userDetails.firstName);
      } else {
        // No user data found, redirect to sign in
        navigate('/signin');
        return;
      }
    }
    
    // Show welcome toast
    toast.success("Welcome to FIND!", {
      description: "Your registration was successful."
    });
    
  }, [location, navigate]);

  const handleGetStarted = () => {
    // Navigate to home page or dashboard
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold mt-4">Welcome, {userName}!</CardTitle>
            <CardDescription>
              Thank you for joining FIND. Your account has been successfully created.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p>You now have access to all our services:</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">🚕</div>
                <div className="text-sm font-medium">Taxi</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">💼</div>
                <div className="text-sm font-medium">Jobs</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">🏠</div>
                <div className="text-sm font-medium">Roommates</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGetStarted} className="w-full bg-find-red hover:bg-red-700">
              Get Started
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Welcome;
