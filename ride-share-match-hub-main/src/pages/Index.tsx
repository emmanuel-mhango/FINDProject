
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import LiveStats from '@/components/LiveStats';
import TaxiBookingCard from '@/components/TaxiBookingCard';
import QuickApplyCard from '@/components/QuickApplyCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Home, User } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section text-white py-24 md:py-40">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Find Everything On a click</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in">
            Your all-in-one solution for finding taxi, job opportunities, and compatible roommates.
          </p>
          <Button 
            className="action-button text-lg px-8 py-6 hover-scale" 
            size="lg"
            onClick={() => navigate('/signin')}
          >
            Get Started
          </Button>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-find-red mb-12">OUR SERVICES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<span className="material-icons">🚕</span>}
              title="Find My Taxi"
              description="Get instant access to nearby taxis and reach your destination safely and comfortably"
              buttonText="Get a Taxi"
              buttonLink="/taxi"
            />
            
            <ServiceCard 
              icon={<Briefcase size={48} />}
              title="Find My Job"
              description="Discover career opportunities that match your qualification and aspiration"
              buttonText="Search Jobs"
              buttonLink="/jobs"
            />
            
            <ServiceCard 
              icon={<Home size={48} />}
              title="Find My Roommate"
              description="Connect with fellow students who share your academic interests and lifestyle"
              buttonText="Match Roommate"
              buttonLink="/roommates"
            />
          </div>
        </div>
      </section>
      
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
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Quick Search</h3>
              <p className="text-gray-300">Find what you need in seconds</p>
            </div>
            
            <div className="p-6 hover:bg-find-dark/90 transition-colors rounded-lg">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Instant Connect</h3>
              <p className="text-gray-300">Chat with matches instantly</p>
            </div>
            
            <div className="p-6 hover:bg-find-dark/90 transition-colors rounded-lg">
              <div className="text-3xl mb-4">🔒</div>
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
