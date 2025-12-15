import React from 'react';
import ServiceCard from '@/components/ServiceCard';
import { CarTaxiFront, Briefcase, Home } from 'lucide-react';

const OurServices = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-find-red mb-12">OUR SERVICES</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            icon={<CarTaxiFront size={48} />}
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
  );
};

export default OurServices;