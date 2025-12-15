
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { MapPin, Users } from 'lucide-react';
import { malawiLocations } from '@/data/malawi-locations';

const TaxiBookingCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  
  // Calculate price based on inputs
  const calculatePrice = () => {
    if (!location || !destination) {
      toast({
        title: "Error",
        description: "Please select both pickup location and destination",
        variant: "destructive",
      });
      return;
    }
    
    setCalculatingPrice(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Get location details
      const pickupLocation = malawiLocations.find(l => l.value === location);
      const destinationLocation = malawiLocations.find(l => l.value === destination);
      
      // Calculate base price based on district distance
      let basePrice = 500; // Base fare in MWK
      
      // If different districts, add extra cost
      if (pickupLocation?.district !== destinationLocation?.district) {
        basePrice += 1500; // Inter-district travel
      } else {
        basePrice += 800; // Same district travel
      }
      
      // Calculate total with passenger count
      const passengerCount = parseInt(passengers);
      const calculatedPrice = basePrice * passengerCount;
      
      setPrice(calculatedPrice);
      setCalculatingPrice(false);
      
      toast({
        title: "Price Calculated",
        description: `Trip for ${passengerCount} passenger${passengerCount > 1 ? 's' : ''}: ${calculatedPrice.toLocaleString()} MWK`,
      });
    }, 1500);
  };
  
  const handleBookNow = () => {
    if (!price && (!location || !destination)) {
      calculatePrice();
      return;
    }
    
    // Store the booking details in localStorage for the booking page
    if (location && destination) {
      localStorage.setItem('taxiBooking', JSON.stringify({
        location,
        destination,
        passengers,
        price
      }));
    }
    
    // Navigate to the dedicated booking page
    navigate('/taxi');
  };

  return (
    <Card className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all">
      <h3 className="text-xl font-bold mb-6">Quick Book</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="pickup">Pickup Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full">
              <MapPin className="text-gray-400 mr-2" size={16} />
              <SelectValue placeholder="Select pickup location" />
            </SelectTrigger>
            <SelectContent>
              {malawiLocations.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label} ({loc.district})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="w-full">
              <MapPin className="text-gray-400 mr-2" size={16} />
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {malawiLocations.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label} ({loc.district})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="passengers">Number of Passengers</Label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger className="w-full">
              <Users className="text-gray-400 mr-2" size={16} />
              <SelectValue placeholder="Select passengers" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} passenger{num > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {price !== null && (
          <div className="bg-gray-100 p-3 rounded-md text-center mb-4">
            <span className="block text-gray-500 text-sm">Estimated Price</span>
            <span className="block text-lg font-bold text-find-red">{price.toLocaleString()} MWK</span>
          </div>
        )}
        
        {price === null ? (
          <Button 
            className="action-button w-full"
            onClick={calculatePrice}
            disabled={calculatingPrice}
          >
            {calculatingPrice ? "Calculating..." : "Calculate Price"}
          </Button>
        ) : (
          <Button 
            className="action-button w-full"
            onClick={handleBookNow}
          >
            Book Now
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TaxiBookingCard;
