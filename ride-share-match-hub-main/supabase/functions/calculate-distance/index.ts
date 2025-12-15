import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pickup, destination } = await req.json();
    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');

    if (!googleMapsApiKey) {
      throw new Error('Google Maps API key not found');
    }

    // Use Google Maps Distance Matrix API to get accurate distance
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.set('origins', `${pickup.lat},${pickup.lng}`);
    url.searchParams.set('destinations', `${destination.lat},${destination.lng}`);
    url.searchParams.set('units', 'metric');
    url.searchParams.set('mode', 'driving');
    url.searchParams.set('key', googleMapsApiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK' || !data.rows[0]?.elements[0]) {
      throw new Error('Failed to calculate distance');
    }

    const element = data.rows[0].elements[0];
    
    if (element.status !== 'OK') {
      throw new Error('Route not found');
    }

    const distanceInMeters = element.distance.value;
    const distanceInKm = distanceInMeters / 1000;
    const durationText = element.duration.text;

    // Calculate price based on distance
    // Base price: 500 MWK
    // Per km: 300 MWK
    const basePrice = 500;
    const pricePerKm = 300;
    const totalPrice = basePrice + (distanceInKm * pricePerKm);

    return new Response(JSON.stringify({
      distance: {
        meters: distanceInMeters,
        kilometers: distanceInKm,
        text: element.distance.text
      },
      duration: {
        seconds: element.duration.value,
        text: durationText
      },
      price: {
        amount: Math.round(totalPrice),
        currency: 'MWK',
        breakdown: {
          base: basePrice,
          distance: Math.round(distanceInKm * pricePerKm),
          rate: `${pricePerKm} MWK/km`
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error calculating distance:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to calculate distance and price',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});