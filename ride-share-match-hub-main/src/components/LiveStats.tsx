
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
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
  const [drivers, setDrivers] = useState(initialDrivers);
  const [jobs, setJobs] = useState(initialJobs);
  const [matches, setMatches] = useState(initialMatches);
  const [recentlyUpdated, setRecentlyUpdated] = useState<string | null>(null);
  const [activeRegions, setActiveRegions] = useState<{ name: string, count: number }[]>([
    { name: 'Lilongwe', count: 432 },
    { name: 'Blantyre', count: 387 },
    { name: 'Mzuzu', count: 256 },
    { name: 'Zomba', count: 143 }
  ]);
  const [hotJobSectors, setHotJobSectors] = useState<{ name: string, trend: number }[]>([
    { name: 'Technology', trend: 15 },
    { name: 'Healthcare', trend: 8 },
    { name: 'Education', trend: 5 },
    { name: 'Agriculture', trend: 12 }
  ]);
  const { toast } = useToast();

  // Update stats more frequently for a more dynamic feel
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance to increment each stat with more variation
      const random = Math.random();
      
      if (random < 0.4) {
        const increment = Math.floor(Math.random() * 5) + 1;
        const newDrivers = drivers + increment;
        setDrivers(newDrivers);
        setRecentlyUpdated('drivers');
        
        // Update active regions randomly
        if (Math.random() < 0.3) {
          setActiveRegions(prevRegions => {
            const newRegions = [...prevRegions];
            const randomIndex = Math.floor(Math.random() * newRegions.length);
            newRegions[randomIndex].count += Math.floor(Math.random() * 3) + 1;
            return newRegions;
          });
        }
        
        // Occasional toast notification about new drivers
        if (Math.random() < 0.1) {
          toast({
            title: "New Driver Alert!",
            description: `${increment} new drivers just joined the platform!`,
            duration: 3000,
          });
        }
      } else if (random < 0.7) {
        const increment = Math.floor(Math.random() * 3) + 1;
        const newJobs = jobs + increment;
        setJobs(newJobs);
        setRecentlyUpdated('jobs');
        
        // Update hot job sectors randomly
        if (Math.random() < 0.3) {
          setHotJobSectors(prevSectors => {
            const newSectors = [...prevSectors];
            const randomIndex = Math.floor(Math.random() * newSectors.length);
            newSectors[randomIndex].trend += Math.floor(Math.random() * 2) + 1;
            return newSectors;
          });
        }
        
        // Occasional toast notification about new jobs
        if (Math.random() < 0.1) {
          toast({
            title: "New Job Listings!",
            description: `${increment} new jobs just posted!`,
            duration: 3000,
          });
        }
      } else {
        const increment = Math.floor(Math.random() * 4) + 1;
        const newMatches = matches + increment;
        setMatches(newMatches);
        setRecentlyUpdated('matches');
        
        // Occasional toast notification about new matches
        if (Math.random() < 0.1) {
          toast({
            title: "New Roommate Match!",
            description: `${increment} new roommate matches made!`,
            duration: 3000,
          });
        }
      }
      
      // Reset the recently updated indicator after animation completes
      setTimeout(() => {
        setRecentlyUpdated(null);
      }, 600);
      
    }, 2000); // Update every 2 seconds for more dynamic feel
    
    return () => clearInterval(interval);
  }, [drivers, jobs, matches, toast]);

  // Visual effect for the changing numbers with enhanced animation
  const StatItem = ({ label, value, icon, type }: { label: string; value: number; icon: React.ReactNode; type: string }) => {
    const isUpdated = recentlyUpdated === type;
    return (
      <div className="flex justify-between items-center group hover:bg-gray-50 p-2 rounded-md transition-colors">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isUpdated ? 'bg-green-100 scale-110' : 'bg-gray-100'} transition-all duration-300`}>
            {icon}
          </div>
          <span className="group-hover:font-medium transition-all">{label}</span>
        </div>
        <span 
          className={`stat-number font-bold ${isUpdated ? 'text-green-600 scale-110' : 'text-find-red'} transition-all duration-300`}
        >
          {value.toLocaleString()}
          {isUpdated && <TrendingUp size={14} className="inline ml-1 text-green-600" />}
        </span>
      </div>
    );
  };

  return (
    <Card className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <span className="animate-pulse mr-2">📊</span> 
          Live Stats
        </h3>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full animate-pulse">
          Live Updates
        </span>
      </div>
      <div className="space-y-3">
        <StatItem 
          label="Active Drivers" 
          value={drivers} 
          icon={<Users size={18} className="text-blue-600" />} 
          type="drivers" 
        />
        <StatItem 
          label="Job Listings" 
          value={jobs} 
          icon={<Briefcase size={18} className="text-amber-600" />} 
          type="jobs" 
        />
        <StatItem 
          label="Roommate matches" 
          value={matches} 
          icon={<Users size={18} className="text-green-600" />} 
          type="matches" 
        />
      </div>
      
      {/* Additional interactive sections */}
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-medium mb-2">Active Regions</h4>
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
      
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-medium mb-2">Hot Job Sectors</h4>
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
      
      <div className="mt-4 pt-3 border-t text-xs text-gray-500 flex items-center justify-center">
        <div className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
          Updating in real-time
        </div>
      </div>
    </Card>
  );
};

export default LiveStats;
