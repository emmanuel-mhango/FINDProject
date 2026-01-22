import React from 'react';
import ServiceCard from '@/components/ServiceCard';
import { CarTaxiFront, Briefcase, Home, Users, Sparkles } from 'lucide-react';

const OurServices = () => {
  return (
    <section id="our-services" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-find-red mb-12">OUR SERVICES</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            icon={<Home size={48} />}
            title="Find Homes"
            description="Browse verified listings added by administrators and contact agents quickly."
            buttonText="Browse Homes"
            buttonLink="/homes"
            status="active"
          />

          <ServiceCard
            icon={<CarTaxiFront size={48} />}
            title="Find Taxi"
            description="Book a nearby taxi fast and track your ride with trusted drivers."
            buttonText="Get a Taxi"
            buttonLink="/taxi"
            status="active"
          />

          <ServiceCard
            icon={<Briefcase size={48} />}
            title="Find Jobs"
            description="Discover career opportunities that match your skills and interests."
            buttonText="Search Jobs"
            buttonLink="/jobs"
            status="active"
          />

          <ServiceCard
            icon={<Users size={48} />}
            title="Find Roommate"
            description="Connect with compatible roommates based on lifestyle and study needs."
            buttonText="Match Roommate"
            buttonLink="/roommates"
            status="inactive"
          />

          <ServiceCard
            icon={<Sparkles size={48} />}
            title="Find Creators"
            description="Hire creators and talent to bring your ideas to life."
            buttonText="Explore Creators"
            buttonLink="/creators"
            status="inactive"
          />
        </div>
      </div>
    </section>
  );
};

export default OurServices;
