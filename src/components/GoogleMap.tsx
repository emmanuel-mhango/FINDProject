import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface GoogleMapProps {
  onPickupSelect?: (location: {lat: number; lng: number; address: string}) => void;
  onDestinationSelect?: (location: {lat: number; lng: number; address: string}) => void;
  pickup?: {lat: number; lng: number; address: string} | null;
  destination?: {lat: number; lng: number; address: string} | null;
}

const GoogleMap: React.FC<GoogleMapProps> = () => {
  return (
    <Card className="w-full h-96 rounded-lg border border-gray-300 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center p-8">
        <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Google Maps Integration</h3>
        <p className="text-gray-500 mb-4">Interactive map coming soon!</p>
        <div className="text-sm text-gray-400">
          For now, please use the location dropdowns above to select your pickup and destination.
        </div>
      </div>
    </Card>
  );
};

export default GoogleMap;