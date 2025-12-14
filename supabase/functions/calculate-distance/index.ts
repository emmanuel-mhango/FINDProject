import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '3600',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { pickup, destination } = body ?? {};
    // Basic validation to surface clear errors instead of runtime exceptions
    if (!pickup || !destination) {
      return new Response(JSON.stringify({ error: 'Missing pickup or destination in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const toNumber = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : NaN;
    };

    const pLat = toNumber(pickup.lat);
    const pLng = toNumber(pickup.lng);
    const dLat = toNumber(destination.lat);
    const dLng = toNumber(destination.lng);

    if ([pLat, pLng, dLat, dLng].some(Number.isNaN)) {
      return new Response(JSON.stringify({ error: 'Invalid coordinates provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const googleMapsApiKey = (globalThis as any).Deno?.env?.get('GOOGLE_MAPS_API_KEY');

    if (!googleMapsApiKey) {
      throw new Error('Google Maps API key not found');
    }

    // Use Google Maps Distance Matrix API to get accurate distance
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.set('origins', `${pLat},${pLng}`);
    url.searchParams.set('destinations', `${dLat},${dLng}`);
    url.searchParams.set('units', 'metric');
    url.searchParams.set('mode', 'driving');
    url.searchParams.set('key', googleMapsApiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK' || !data.rows[0]?.elements[0]) {
      const apiMessage = data.error_message ?? null;
      throw new Error(`Failed to calculate distance (status: ${data.status})${apiMessage ? `: ${apiMessage}` : ''}`);
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
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error calculating distance:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to calculate distance and price',
      details: message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});