
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Briefcase, Users, MapPin } from 'lucide-react';

interface StatsProps {
  initialDrivers?: number;
  initialJobs?: number;
  initialMatches?: number;
}

const LiveStats: React.FC<StatsProps> = ({
  initialDrivers = 1354,
  initialJobs = 2349,
  initialMatches = 1456,
}) => {
  const drivers = initialDrivers;
  const jobs = initialJobs;
  const matches = initialMatches;
  const activeRegions = [
    { name: 'Lilongwe', count: 432 },
    { name: 'Blantyre', count: 387 },
    { name: 'Mzuzu', count: 256 },
    { name: 'Zomba', count: 143 }
  ];
  const hotJobSectors = [
    { name: 'Technology', trend: 15 },
    { name: 'Healthcare', trend: 8 },
    { name: 'Education', trend: 5 },
    { name: 'Agriculture', trend: 12 }
  ];

  const StatItem = ({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) => {
    return (
      <div className="flex justify-between items-center group hover:bg-gray-50 p-2 rounded-md transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gray-100 transition-all duration-300">
            {icon}
          </div>
          <span className="group-hover:font-medium transition-all">{label}</span>
        </div>
        <span className="stat-number font-bold text-find-red transition-all duration-300">
          {value.toLocaleString()}
        </span>
      </div>
    );
  };

  return (
    <Card className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center">
          FIND Stats
        </h3>
      </div>
      
      {/* Horizontal arrangement of sections as separate cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Current Stats Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm border border-blue-100">
          <h4 className="text-sm font-medium mb-3 text-blue-800">Current Statistics</h4>
          <div className="space-y-3">
            <StatItem 
              label="Active Drivers" 
              value={drivers} 
              icon={<Users size={18} className="text-blue-600" />} 
            />
            <StatItem 
              label="Job Listings" 
              value={jobs} 
              icon={<Briefcase size={18} className="text-amber-600" />} 
            />
            <StatItem 
              label="Roommate matches" 
              value={matches} 
              icon={<Users size={18} className="text-green-600" />} 
            />
          </div>
        </div>
        
        {/* Active Regions Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg shadow-sm border border-green-100">
          <h4 className="text-sm font-medium mb-3 text-green-800">Active Regions</h4>
          <div className="space-y-2">
            {activeRegions.map((region, index) => (
              <div key={index} className="flex justify-between text-xs">
                <div className="flex items-center">
                  <MapPin size={12} className="mr-1 text-gray-500" />
                  <span>{region.name}</span>
                </div>
                <span className="font-medium">{region.count} users</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Hot Job Sectors Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg shadow-sm border border-amber-100">
          <h4 className="text-sm font-medium mb-3 text-amber-800">Hot Job Sectors</h4>
          <div className="space-y-2">
            {hotJobSectors.map((sector, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span>{sector.name}</span>
                <span className="text-green-600 flex items-center">
                  +{sector.trend}% <TrendingUp size={12} className="ml-1" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </Card>
  );
};

export default LiveStats;
