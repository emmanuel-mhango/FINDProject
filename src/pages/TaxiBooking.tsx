import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Car, MapPin, Phone, CreditCard, FileText, Receipt, CheckCircle, CircleX , Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoogleMap from '@/components/GoogleMap';
import AuthGuard from '@/components/AuthGuard';
import { malawiLocations } from '@/data/malawi-locations';

const formSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  passengers: z.string().min(1, "Number of passengers is required"),
  notes: z.string().optional(),
});

const TaxiBooking = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      paymentMethod: "",
      passengers: "1",
      notes: "",
    },
  });

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
      // Get location details
      const pickup = malawiLocations.find(l => l.value === pickupLocation);
      const destination = malawiLocations.find(l => l.value === destinationLocation);
      
      // Calculate base price based on district distance
      let basePrice = 500; // Base fare in MWK
      
      // If different districts, add extra cost
      if (pickup?.district !== destination?.district) {
        basePrice += 1500; // Inter-district travel
      } else {
        basePrice += 800; // Same district travel
      }
      
      // Calculate total with passenger count
      const passengerCount = parseInt(passengers);
      const calculatedTotal = basePrice * passengerCount;
      
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
      const pickupLocationData = malawiLocations.find(l => l.value === pickupLocation);
      const destinationLocationData = malawiLocations.find(l => l.value === destinationLocation);
      
      const newBooking = {
        id: bookingRef,
        user_id: JSON.parse(userData).email, // Use email as user id
        pickup_location: pickupLocationData?.label || pickupLocation,
        destination: destinationLocationData?.label || destinationLocation,
        price: calculatedPrice,
        phone: values.phone,
        payment_method: values.paymentMethod,
        notes: values.notes,
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
      setPickupLocation(booking.location || '');
      setDestinationLocation(booking.destination || '');
      setPassengers(booking.passengers || '1');
      if (booking.price) {
        setCalculatedPrice(booking.price);
      }
      localStorage.removeItem('taxiBooking'); // Clear after loading
    }
  }, []);

  return (
    <AuthGuard message="Please sign in to book a taxi">
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-6 w-6" />
                Book a Taxi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Trip Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickup">Pickup Location</Label>
                    <Select value={pickupLocation} onValueChange={setPickupLocation}>
                      <SelectTrigger>
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
                    <Select value={destinationLocation} onValueChange={setDestinationLocation}>
                      <SelectTrigger>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passengers">Number of Passengers</Label>
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger>
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

                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={calculatePrice}
                      disabled={!pickupLocation || !destinationLocation || isCalculating}
                      className="flex items-center gap-2 w-full"
                    >
                      {isCalculating ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4" />
                      )}
                      Calculate Price
                    </Button>
                  </div>
                </div>
                
                {calculatedPrice && (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg text-green-800">{calculatedPrice.toLocaleString()} MWK</p>
                        <p className="text-sm text-green-600">
                          For {passengers} passenger{parseInt(passengers) > 1 ? 's' : ''}
                        </p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </Card>
                )}

                {/* Google Maps Coming Soon */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Map View</h3>
                  <GoogleMap />
                </div>
              </div>

              {/* Booking Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    className="w-full" 
                    size="lg" 
                    disabled={!calculatedPrice}
                  >
                    Book Taxi
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
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
                    {malawiLocations.find(l => l.value === pickupLocation)?.label || pickupLocation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">To:</span>
                  <span className="text-sm text-right max-w-[200px]">
                    {malawiLocations.find(l => l.value === destinationLocation)?.label || destinationLocation}
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
                navigate('/pages/TaxiBooking.tsx');
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