import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface GoogleMapProps {
  onPickupSelect?: (location: { lat: number; lng: number; address: string }) => void;
  onDestinationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  pickup?: { lat: number; lng: number; address: string } | null;
  destination?: { lat: number; lng: number; address: string } | null;
  selectionMode?: "pickup" | "destination";
  onMapReady?: () => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  onPickupSelect,
  onDestinationSelect,
  pickup,
  destination,
  selectionMode = "destination",
  onMapReady,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    if (!apiKey || !mapRef.current) {
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (!mapRef.current) {
        return;
      }

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: -13.2543, lng: 34.3015 },
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
      });

      mapInstanceRef.current = map;
      onMapReady?.();

      const geocoder = new google.maps.Geocoder();

      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) {
          return;
        }

        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          const address =
            status === "OK" && results && results[0] ? results[0].formatted_address : "Selected location";

          if (selectionMode === "pickup") {
            onPickupSelect?.({ lat, lng, address });
          } else {
            onDestinationSelect?.({ lat, lng, address });
          }
        });
      });
    });
  }, [onDestinationSelect, onPickupSelect, onMapReady, selectionMode]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }

    if (pickup) {
      if (!pickupMarkerRef.current) {
        pickupMarkerRef.current = new google.maps.Marker({
          map,
          position: { lat: pickup.lat, lng: pickup.lng },
          label: "P",
        });
      } else {
        pickupMarkerRef.current.setPosition({ lat: pickup.lat, lng: pickup.lng });
      }
    } else if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setMap(null);
      pickupMarkerRef.current = null;
    }

    if (destination) {
      if (!destinationMarkerRef.current) {
        destinationMarkerRef.current = new google.maps.Marker({
          map,
          position: { lat: destination.lat, lng: destination.lng },
          label: "D",
        });
      } else {
        destinationMarkerRef.current.setPosition({ lat: destination.lat, lng: destination.lng });
      }
    } else if (destinationMarkerRef.current) {
      destinationMarkerRef.current.setMap(null);
      destinationMarkerRef.current = null;
    }
  }, [pickup, destination]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  if (!apiKey) {
    return (
      <Card className="w-full h-96 rounded-lg border border-gray-300 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center p-8">
          <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Google Maps API key required</h3>
          <p className="text-gray-500 mb-4">
            Add <span className="font-semibold">VITE_GOOGLE_MAPS_API_KEY</span> to enable map-based selection.
          </p>
        </div>
      </Card>
    );
  }

  return <div ref={mapRef} className="w-full h-96 rounded-lg border border-gray-300" />;
};

export default GoogleMap;
