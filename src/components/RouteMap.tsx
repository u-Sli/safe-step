import React, { useEffect, useRef, useState } from 'react';
import { RoutePoint, RouteOption } from '../services/routeService';

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface RouteMapProps {
  routes: RouteOption[];
  origin?: RoutePoint;
  destination?: RoutePoint;
  onRouteSelect?: (route: RouteOption) => void;
  selectedRoute?: RouteOption | null;
}

const RouteMap: React.FC<RouteMapProps> = ({ routes, origin, destination, onRouteSelect, selectedRoute }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [polylines, setPolylines] = useState<google.maps.Polyline[]>([]);

  useEffect(() => {
    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (map && routes.length > 0) {
      drawRoutes();
    }
  }, [map, routes]);

  useEffect(() => {
    if (selectedRoute && map) {
      // Highlight selected route by adjusting all route styles
      // This is handled by the DirectionsRenderer styling
      console.log('Selected route:', selectedRoute.id);
    }
  }, [selectedRoute, map, routes]);

  const loadGoogleMaps = () => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Create script tag to load Google Maps (no API key needed for demo)
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?callback=initMap&libraries=geometry`;
    script.async = true;
    script.defer = true;
    
    // Set global callback
    window.initMap = initializeMap;
    
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Default center (Johannesburg, South Africa)
    const center = origin || { lat: -26.2041, lng: 28.0473 };

    // Create Google Map with full controls
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: center,
      mapTypeId: 'roadmap', // Use roadmap to see roads clearly
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      gestureHandling: 'greedy', // Allow mouse wheel zoom and drag
      draggable: true,
      scrollwheel: true,
      panControl: true,
      rotateControl: true,
      scaleControl: true
    });

    setMap(map);

    // Add markers if origin and destination exist
    if (origin) {
      new window.google.maps.Marker({
        position: origin,
        map: map,
        title: 'Start',
        label: 'A',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#22c55e" stroke="white" stroke-width="4"/>
              <text x="16" y="21" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">A</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });
    }

    if (destination) {
      new window.google.maps.Marker({
        position: destination,
        map: map,
        title: 'Destination',
        label: 'B',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#ef4444" stroke="white" stroke-width="4"/>
              <text x="16" y="21" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">B</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });
    }
  };

  const drawRoutes = () => {
    if (!map || !window.google || routes.length === 0) return;

    // Clear existing polylines
    polylines.forEach(polyline => polyline.setMap(null));
    const newPolylines: google.maps.Polyline[] = [];

    routes.forEach((route) => {
      // Use DirectionsRenderer for road-snapped routes
      if (route.path.length >= 2) {
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: route.color,
            strokeOpacity: 0.8,
            strokeWeight: 6,
            clickable: true
          }
        });

        directionsRenderer.setMap(map);

        // Calculate route using Google Directions for road-snapping
        directionsService.route({
          origin: new window.google.maps.LatLng(route.path[0].lat, route.path[0].lng),
          destination: new window.google.maps.LatLng(
            route.path[route.path.length - 1].lat, 
            route.path[route.path.length - 1].lng
          ),
          travelMode: window.google.maps.TravelMode.WALKING, // Use walking for pedestrian routes
          avoidHighways: route.type === 'safest',
          avoidTolls: route.type === 'safest'
        }, (result, status) => {
          if (status === 'OK' && result) {
            directionsRenderer.setDirections(result);
            
            // Add click listener to the route
            const polyline = directionsRenderer.getDirections()?.routes[0];
            if (polyline) {
              directionsRenderer.addListener('click', () => {
                if (onRouteSelect) {
                  onRouteSelect(route);
                }
              });
            }
          } else {
            // Fallback to simple polyline if directions fail
            const path = route.path.map(point => new window.google.maps.LatLng(point.lat, point.lng));
            const polyline = new window.google.maps.Polyline({
              path: path,
              geodesic: true,
              strokeColor: route.color,
              strokeOpacity: 0.8,
              strokeWeight: 6,
              clickable: true,
            });

            polyline.addListener('click', () => {
              if (onRouteSelect) {
                onRouteSelect(route);
              }
            });

            polyline.setMap(map);
            newPolylines.push(polyline);
          }
        });
      }
    });

    setPolylines(newPolylines);
  };

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: '400px' }}
        className="rounded-lg overflow-hidden shadow-sm cursor-grab active:cursor-grabbing"
        title="Drag to pan, scroll to zoom"
      />
      
      {/* Map controls info */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
        🖱️ Drag to move • 🔍 Scroll to zoom • 🗺️ Click controls to change view
      </div>
    </div>
  );
};

export default RouteMap;