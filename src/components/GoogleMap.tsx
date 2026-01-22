import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getRuntimeConfig } from '@/lib/runtimeConfig';

interface MapLocation {
  lat: number;
  lng: number;
  address: string;
}

interface GoogleMapProps {
  onPickupSelect?: (location: MapLocation) => void;
  onDestinationSelect?: (location: MapLocation) => void;
  pickup?: MapLocation | null;
  destination?: MapLocation | null;
  onReady?: () => void;
}

const DEFAULT_CENTER = { lat: -13.9626, lng: 33.7741 };

const GoogleMap: React.FC<GoogleMapProps> = ({
  onPickupSelect,
  onDestinationSelect,
  pickup,
  destination,
  onReady,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const pickupMarker = useRef<google.maps.Marker | null>(null);
  const destinationMarker = useRef<google.maps.Marker | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const autocomplete = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadMap = async () => {
      const runtimeConfig = await getRuntimeConfig();
      if (cancelled) return;
      const apiKey = runtimeConfig.googleMapsApiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) return;

      const loader = new Loader({
        apiKey,
        libraries: ['places', 'geometry'],
      });

      loader.load().then(() => {
        if (cancelled) return;
        if (!mapRef.current) return;
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: true,
        });
        geocoder.current = new google.maps.Geocoder();
        setIsLoaded(true);
        onReady?.();

        if (searchRef.current) {
          autocomplete.current = new google.maps.places.Autocomplete(searchRef.current, {
            fields: ['geometry', 'formatted_address', 'name'],
          });
          autocomplete.current.addListener('place_changed', () => {
            const place = autocomplete.current?.getPlace();
            if (!place?.geometry?.location) return;
            const loc = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              address: place.formatted_address || place.name || 'Selected destination',
            };
            setDestination(loc);
          });
        }

        mapInstance.current.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (!event.latLng) return;
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          reverseGeocode({ lat, lng }, (address) => {
            setDestination({ lat, lng, address });
          });
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const loc = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                address: 'Current location',
              };
              reverseGeocode(loc, (address) => {
                const resolved = { ...loc, address };
                setPickup(resolved);
                mapInstance.current?.setCenter({ lat: loc.lat, lng: loc.lng });
              });
            },
            () => {
              setPickup({
                lat: DEFAULT_CENTER.lat,
                lng: DEFAULT_CENTER.lng,
                address: 'Current location unavailable',
              });
            }
          );
        }
      });
    };

    loadMap();

    return () => {
      cancelled = true;
    };
  }, [onReady]);

  useEffect(() => {
    if (!isLoaded || !mapInstance.current) return;
    if (pickup) {
      if (!pickupMarker.current) {
        pickupMarker.current = new google.maps.Marker({
          map: mapInstance.current,
          position: { lat: pickup.lat, lng: pickup.lng },
          label: {
            text: 'P',
            color: '#ffffff',
            fontWeight: '700',
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#dc2626',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });
      } else {
        pickupMarker.current.setPosition({ lat: pickup.lat, lng: pickup.lng });
      }
    }
  }, [pickup, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !mapInstance.current) return;
    if (destination) {
      if (!destinationMarker.current) {
        destinationMarker.current = new google.maps.Marker({
          map: mapInstance.current,
          position: { lat: destination.lat, lng: destination.lng },
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 5,
            fillColor: '#111827',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });
      } else {
        destinationMarker.current.setPosition({ lat: destination.lat, lng: destination.lng });
      }
    }

    if (pickup && destination) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: pickup.lat, lng: pickup.lng });
      bounds.extend({ lat: destination.lat, lng: destination.lng });
      mapInstance.current.fitBounds(bounds);
    }
  }, [destination, pickup, isLoaded]);

  const setPickup = (location: MapLocation) => {
    onPickupSelect?.(location);
  };

  const setDestination = (location: MapLocation) => {
    onDestinationSelect?.(location);
  };

  const reverseGeocode = (location: { lat: number; lng: number }, cb: (address: string) => void) => {
    if (!geocoder.current) {
      cb('Selected location');
      return;
    }
    geocoder.current.geocode({ location }, (results) => {
      const address = results?.[0]?.formatted_address || 'Selected location';
      cb(address);
    });
  };

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-2">
        <div className="flex-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              ref={searchRef}
              placeholder="Search destination"
              className="pl-9 bg-white/95 backdrop-blur"
            />
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/95 px-3 py-2 rounded-lg text-xs text-gray-600">
          <Navigation className="h-4 w-4 text-find-red" />
          Tap map to set destination
        </div>
      </div>
      <div ref={mapRef} className="h-[420px] w-full rounded-3xl overflow-hidden" />
      {!isLoaded && (
        <div className="absolute inset-0 rounded-3xl bg-gray-100 flex items-center justify-center text-sm text-gray-500">
          Loading map...
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
