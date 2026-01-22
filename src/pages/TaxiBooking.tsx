import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Car, MapPin, Phone, CreditCard, FileText, CheckCircle, CircleX, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  driverId: z.string().min(1, "Driver is required"),
  phone: z.string().min(1, "Phone number is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  passengers: z.string().min(1, "Number of passengers is required"),
  notes: z.string().optional(),
});

type MapLocation = { lat: number; lng: number; address: string };

const TaxiBooking = () => {
  const { toast } = useToast();
  const [pickupLocation, setPickupLocation] = useState<MapLocation | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<MapLocation | null>(null);
  const [passengers, setPassengers] = useState('1');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [detectedCity, setDetectedCity] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'unavailable' | 'denied' | 'unknown'>('idle');
  const [pickupArea, setPickupArea] = useState('');
  const [destinationArea, setDestinationArea] = useState('');
  const navigate = useNavigate();

  const cityAreas: Record<string, string[]> = useMemo(() => ({
    Mzuzu: ['Chibavi', 'Mzuzu City Centre', 'Luwinga', 'Chikanda', 'Mchengautuwa'],
    Lilongwe: ['Area 3', 'Area 10', 'Area 12', 'Area 18', 'Area 25'],
    Blantyre: ['Namiwawa', 'Chilomoni', 'Machinjiri', 'Kanjedza', 'Limbe'],
    Zomba: ['Sadzi', 'Masongola', 'Chikanda', 'Mucheke', 'Zomba City Centre']
  }), []);

  const getCityFromCoords = (lat: number, lng: number) => {
    if (lat >= -11.65 && lat <= -11.80 && lng >= 33.85 && lng <= 34.10) return 'Mzuzu';
    if (lat >= -13.85 && lat <= -14.10 && lng >= 33.65 && lng <= 33.95) return 'Lilongwe';
    if (lat >= -15.85 && lat <= -15.60 && lng >= 34.90 && lng <= 35.10) return 'Blantyre';
    if (lat >= -16.00 && lat <= -15.30 && lng >= 35.20 && lng <= 35.45) return 'Zomba';
    return '';
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      driverId: "",
      phone: "",
      paymentMethod: "",
      passengers: "1",
      notes: "",
    },
  });
  const activeDrivers = drivers.filter((driver) => driver.active);
  const nearbyDrivers = pickupLocation
    ? activeDrivers.filter((driver) => {
        const driverLocation = String(driver.location || '').toLowerCase();
        const pickupAddress = pickupLocation.address.toLowerCase();
        if (!driverLocation) return true;
        return pickupAddress.includes(driverLocation) || driverLocation.includes(pickupAddress);
      })
    : activeDrivers;

  const calculatePrice = () => {
    if (!pickupLocation || !destinationLocation) {
      toast({
        title: "Missing Locations",
        description: "Please select both pickup and destination locations.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation with timeout
    setTimeout(() => {
      const passengerCount = parseInt(passengers);
      const sameArea = pickupLocation.address === destinationLocation.address;
      const km = sameArea ? 3 : 8;
      const baseFare = 500;
      const perKmRate = 600;
      const perPersonFare = baseFare + km * perKmRate;
      const calculatedTotal = Math.round(perPersonFare * passengerCount);

      setDistanceKm(Number(km.toFixed(2)));
      setCalculatedPrice(calculatedTotal);
      setIsCalculating(false);
      
      toast({
        title: "Price Calculated",
        description: `Trip for ${passengerCount} passenger${passengerCount > 1 ? 's' : ''}: ${calculatedTotal.toLocaleString()} MWK`,
      });
    }, 1500);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!pickupLocation || !destinationLocation || !calculatedPrice) {
      toast({
        title: "Missing Information",
        description: "Please select locations and calculate price first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user is logged in via localStorage
      const userData = localStorage.getItem('userData');
      if (!userData) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to book a taxi.",
          variant: "destructive",
        });
        return;
      }

      // Save booking locally
      const bookingRef = `FIND-${Date.now()}`;
      
      const selectedDriver = nearbyDrivers.find((driver) => driver.id === values.driverId);
      if (!selectedDriver) {
        toast({
          title: "Driver Unavailable",
          description: "Please select an available driver.",
          variant: "destructive",
        });
        return;
      }

      const newBooking = {
        id: bookingRef,
        user_id: JSON.parse(userData).email, // Use email as user id
        pickup_location: pickupLocation.address,
        destination: destinationLocation.address,
        pickup_coords: { lat: pickupLocation.lat, lng: pickupLocation.lng },
        destination_coords: { lat: destinationLocation.lat, lng: destinationLocation.lng },
        price: calculatedPrice,
        phone: values.phone,
        payment_method: values.paymentMethod,
        notes: values.notes,
        driver: {
          id: selectedDriver.id,
          name: selectedDriver.name,
          phone: selectedDriver.phone,
          vehicle: selectedDriver.vehicle,
          plate: selectedDriver.plate,
        },
        booking_reference: bookingRef,
        created_at: new Date().toISOString(),
        status: 'confirmed'
      };

      // Get existing bookings
      const existingBookings = JSON.parse(localStorage.getItem('taxiBookings') || '[]');
      existingBookings.push(newBooking);
      localStorage.setItem('taxiBookings', JSON.stringify(existingBookings));

      setBookingId(bookingRef);
      
      // If payment method is cash, skip payment dialog and go directly to receipt
      if (values.paymentMethod === 'cash') {
        confirmBooking();
      } else if(values.paymentMethod === 'mobile-money') {
        setShowMobile(true);
        /*toast({
      title: "MOBILE PAYMENT COMING SOON",
      description: `Mobile Money payment option will be available in future updates.`,
    });*/
      }
      else {
        setShowPaymentDialog(true);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const processPayment = () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPaymentDialog(false);
      confirmBooking();
    }, 3000);
  };

  const confirmBooking = () => {
    setBookingConfirmed(true);
    setShowReceipt(true);
    
    toast({
      title: "Booking Confirmed!",
      description: `Your taxi has been booked. Booking ID: ${bookingId}`,
    });
  };

  // Load booking data from localStorage if available
  useEffect(() => {
    const savedBooking = localStorage.getItem('taxiBooking');
    if (savedBooking) {
      const booking = JSON.parse(savedBooking);
      if (booking.pickup_coords && booking.pickup_location) {
        setPickupLocation({
          lat: booking.pickup_coords.lat,
          lng: booking.pickup_coords.lng,
          address: booking.pickup_location,
        });
      }
      if (booking.destination_coords && booking.destination) {
        setDestinationLocation({
          lat: booking.destination_coords.lat,
          lng: booking.destination_coords.lng,
          address: booking.destination,
        });
      }
      setPassengers(booking.passengers || '1');
      if (booking.price) {
        setCalculatedPrice(booking.price);
      }
      localStorage.removeItem('taxiBooking'); // Clear after loading
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      return;
    }
    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const city = getCityFromCoords(position.coords.latitude, position.coords.longitude);
        if (city) {
          setDetectedCity(city);
          setLocationStatus('idle');
        } else {
          setLocationStatus('unknown');
        }
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => {
    if (!detectedCity) return;
    const areas = cityAreas[detectedCity] || [];
    if (!pickupArea && areas.length) {
      setPickupArea(areas[0]);
    }
    if (!destinationArea && areas.length > 1) {
      setDestinationArea(areas[1]);
    }
  }, [cityAreas, detectedCity, pickupArea, destinationArea]);

  useEffect(() => {
    if (detectedCity && pickupArea) {
      setPickupLocation({ lat: 0, lng: 0, address: `${pickupArea}, ${detectedCity}` });
    }
  }, [detectedCity, pickupArea]);

  useEffect(() => {
    if (detectedCity && destinationArea) {
      setDestinationLocation({ lat: 0, lng: 0, address: `${destinationArea}, ${detectedCity}` });
    }
  }, [detectedCity, destinationArea]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('adminTaxiDrivers');
      const parsed = stored ? JSON.parse(stored) : [];
      setDrivers(parsed);
    } catch {
      setDrivers([]);
    }
  }, []);

  return (
    <AuthGuard message="Please sign in to book a taxi">
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
                <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
                  <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-find-red/10 flex items-center justify-center">
                      <Car className="h-6 w-6 text-find-red" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Find Taxi</p>
                      <h2 className="text-2xl font-bold">Book a Ride</h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                  <div>
                    <Label htmlFor="city">Your City</Label>
                    <Select value={detectedCity} onValueChange={setDetectedCity}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(cityAreas).map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {locationStatus === 'detecting' && (
                      <p className="text-xs text-gray-500 mt-2">Detecting your location...</p>
                    )}
                    {locationStatus === 'denied' && (
                      <p className="text-xs text-gray-500 mt-2">Location access denied. Please select your city.</p>
                    )}
                    {locationStatus === 'unavailable' && (
                      <p className="text-xs text-gray-500 mt-2">Location is unavailable in this browser.</p>
                    )}
                    {locationStatus === 'unknown' && (
                      <p className="text-xs text-gray-500 mt-2">We could not detect your town. Please select it.</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="pickup">Pickup Location</Label>
                    <Select value={pickupArea} onValueChange={setPickupArea} disabled={!detectedCity}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select pickup area" />
                      </SelectTrigger>
                      <SelectContent>
                        {(cityAreas[detectedCity] || []).map((area) => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="pickup"
                      readOnly
                      className="mt-2"
                      value={pickupLocation?.address || 'Detecting current location...'}
                    />
                    <p className="text-xs text-gray-500 mt-2">Pickup is detected from your device or selected above.</p>
                  </div>

                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Select value={destinationArea} onValueChange={setDestinationArea} disabled={!detectedCity}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select destination area" />
                      </SelectTrigger>
                      <SelectContent>
                        {(cityAreas[detectedCity] || []).map((area) => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="destination"
                      readOnly
                      className="mt-2"
                      value={destinationLocation?.address || 'Select a destination area'}
                    />
                    <p className="text-xs text-gray-500 mt-2">Map is disabled for now.</p>
                  </div>

                    <div>
                      <Label htmlFor="passengers">Passengers</Label>
                      <Select value={passengers} onValueChange={setPassengers}>
                        <SelectTrigger className="mt-2">
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

                    <Button
                      type="button"
                      onClick={calculatePrice}
                      disabled={!pickupLocation || !destinationLocation || isCalculating}
                      className="w-full bg-find-red hover:bg-red-700"
                    >
                      {isCalculating ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Calculate Price'
                      )}
                    </Button>

                    {calculatedPrice && (
                      <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                        <p className="text-sm text-green-700">Estimated fare</p>
                        <p className="text-2xl font-semibold text-green-800">{calculatedPrice.toLocaleString()} MWK</p>
                        <p className="text-xs text-green-600 mt-1">
                          For {passengers} passenger{parseInt(passengers) > 1 ? 's' : ''}
                        </p>
                        {distanceKm !== null && (
                          <p className="text-xs text-green-600 mt-1">
                            Distance: {distanceKm.toLocaleString()} km
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-white/60">Route preview</p>
                          <h3 className="text-lg font-semibold">Live Map</h3>
                        </div>
                        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-white text-center">
                      <p className="text-sm text-gray-600">Map integration is coming soon.</p>
                    </div>
                  </CardContent>
                </Card>

                {nearbyDrivers.length === 0 && (
                  <Card className="p-4 bg-yellow-50 border-yellow-200 rounded-2xl">
                    <p className="text-sm text-yellow-800">
                      No drivers are available near your pickup location yet.
                    </p>
                  </Card>
                )}

                <Card className="border-0 shadow-lg rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-find-red" />
                      Confirm Your Ride
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="driverId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Car className="h-4 w-4" />
                                Select Driver
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={nearbyDrivers.length === 0}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={nearbyDrivers.length === 0 ? 'No drivers available' : 'Select a driver'} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {nearbyDrivers.map((driver) => (
                                    <SelectItem key={driver.id} value={driver.id}>
                                      {driver.name} - {driver.vehicle}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Payment Method
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="cash">Cash</SelectItem>
                                  <SelectItem value="mobile-money">Mobile Money</SelectItem>
                                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Additional Notes (Optional)
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Any special instructions for the driver..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full bg-find-red hover:bg-red-700 text-white"
                          size="lg"
                          disabled={!calculatedPrice || nearbyDrivers.length === 0}
                        >
                          Book Taxi
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
              <DialogDescription>
                Please enter your payment details to confirm your booking.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{calculatedPrice} MWK</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="card-name">Card Holder Name</Label>
                  <Input 
                    id="card-name"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input 
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="card-expiry">Expiry Date</Label>
                    <Input 
                      id="card-expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input 
                      id="card-cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={processPayment} 
                className="w-full" 
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Receipt Dialog */}
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Booking Confirmed
              </DialogTitle>
              <DialogDescription>
                Your taxi has been booked successfully!
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Booking ID:</span>
                  <span className="font-mono text-sm">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">From:</span>
                  <span className="text-sm text-right max-w-[200px]">
                    {pickupLocation?.address || 'Pickup'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">To:</span>
                  <span className="text-sm text-right max-w-[200px]">
                    {destinationLocation?.address || 'Destination'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Passengers:</span>
                  <span className="text-sm">{passengers}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span>{calculatedPrice} MWK</span>
                </div>
                {bookingId && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Driver:</span>
                    <span className="text-sm">
                      {activeDrivers.find((driver) => driver.id === form.getValues('driverId'))?.name || 'Assigned'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>A driver will contact you shortly at the provided phone number.</p>
                <p className="mt-2">Thank you for using FIND!</p>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                setShowReceipt(false);
                navigate('/');
              }}
              className="w-full"
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>

          {/* Mobile Dialog*/}
        <Dialog open={showMobile} onOpenChange={setShowMobile}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CircleX className="h-6 w-6 text-red-600" />
                Mobile Payment Coming Soon
              </DialogTitle>
              <DialogDescription>
                Mobile Money payment option will be available in future updates.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center gap-6 mt-4">
                <img
                  src="/images/airtel.png"
                  alt="Airtel Money"
                  className="h-14 opacity-40 pointer-events-none"
                  />
                  <img
                  src="/images/tnm.jpg"
                  alt="TNM Mpamba"
                  className="h-14 opacity-40  pointer-events-none"
                  />
                  <img 
                  src="/images/nb.png"
                  alt="National Bank"
                  className="h-14 opacity-40 pointer-events-none"
                  />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>Please use Cash or Card payment methods for now.</p>
                <p className="mt-2">Thank you for using FIND!</p>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                setShowMobile(false);
                navigate('/');
              }}
              className="w-full"
            >
              Back
            </Button>
          </DialogContent>
        </Dialog>

        
      </div>
    </AuthGuard>
  );
};

export default TaxiBooking;
