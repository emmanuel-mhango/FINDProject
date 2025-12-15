
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OurServices from '@/components/OurServices';
import LiveStats from '@/components/LiveStats';
import TaxiBookingCard from '@/components/TaxiBookingCard';
import QuickApplyCard from '@/components/QuickApplyCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Search, MessagesSquare, ShieldCheck } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const userData = localStorage.getItem('userData');
  const user = userData ? JSON.parse(userData) : null;
  const isLoggedIn = !!user;

  const scrollToServices = () => {
    const servicesSection = document.getElementById('our-services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section text-white relative h-screen bg-cover bg-center"
        style ={ {
              backgroundImage: `url('herobg.jpg')`,
        }}>
            {/*Dark Overlay*/}
            <div className="absolute inset-0 bg-black opacity-70" z-0></div>

            {/*Hero section content*/}
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col justify-center items-center h-full font-inter">
          {isLoggedIn ? (
            <>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in font-inter font-extrabold">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in font-inter">
                Ready to find your next taxi, job opportunity, or perfect roommate?
              </p>
              <Button 
                className="action-button text-lg px-8 py-6 hover-scale" 
                size="lg"
                onClick={scrollToServices}
              >
                Our services
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in font-inter font-extrabold">Find Everything On a click</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in font-inter ">
                Your all-in-one solution for finding taxi, job opportunities, and compatible roommates.
              </p>
              <Button 
                className="action-button text-lg font-bold px-8 py-6 hover-scale" 
                size="lg"
                onClick={() => navigate('/signin')}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </section>
      
      {/* Services Section */}
      <OurServices />
      
      {/* Quick Actions Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stats Card */}
            <LiveStats />
            
            {/* Quick Book Card - replaced with TaxiBookingCard */}
            <TaxiBookingCard />
            
            {/* Quick Apply Card - replaced with QuickApplyCard */}
            <QuickApplyCard />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-find-dark text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 hover:bg-find-dark/90 transition-colors rounded-lg">
              <Search className="w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Quick Search</h3>
              <p className="text-gray-300">Find what you need in seconds</p>
            </div>
            
            <div className="p-6 hover:bg-find-dark/90 transition-colors rounded-lg">
              <MessagesSquare className="w-10 h-10 mx-auto mb-4"/>
              <h3 className="text-xl font-bold mb-2">Instant Connect</h3>
              <p className="text-gray-300">Chat with matches instantly</p>
            </div>
            
            <div className="p-6 hover:bg-find-dark/90 transition-colors rounded-lg">
              <ShieldCheck className="w-10 h-10 mx-auto mb-4"/>
              <h3 className="text-xl font-bold mb-2">Verified Profile</h3>
              <p className="text-gray-300">Trusted and safety guaranteed</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
