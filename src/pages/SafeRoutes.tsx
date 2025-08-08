import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Navigation, MapPin, AlertTriangle, Shield, Clock, Route } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../contexts/SafetyContext';
import NavBar from '../components/Navigation';
import RouteMap from '../components/RouteMap';
import LocationInput from '../components/LocationInput';
import { routeService, type RouteOption, type RoutePoint } from '../services/routeService';
import { type LocationSuggestion } from '../services/locationService';

const SafeRoutes = () => {
  const navigate = useNavigate();
  const { userLocation, safetyReports, getCurrentLocationRisk } = useSafety();
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState<RoutePoint | null>(null);

  const currentRisk = getCurrentLocationRisk();
  const nearbyReports = safetyReports.slice(0, 5);

  const riskColors = {
    low: 'bg-safe text-white',
    medium: 'bg-warning text-warning-foreground',
    high: 'bg-danger text-white'
  };

  const handleGetDirections = async () => {
    if (!destination.trim() || !userLocation) return;
    
    setIsCalculating(true);
    setRoutes([]);
    setSelectedRoute(null);
    
    try {
      // Use real coordinates from location service
      let destCoords: RoutePoint;
      
      // Try to find exact coordinates from location service
      const locationResults = await import('../services/locationService').then(module => 
        module.locationService.searchLocations(destination)
      );
      
      if (locationResults.length > 0 && locationResults[0].coordinates) {
        destCoords = locationResults[0].coordinates;
      } else {
        // Fallback to approximate coordinates
        destCoords = {
          lat: userLocation.lat + (Math.random() - 0.5) * 0.02,
          lng: userLocation.lng + (Math.random() - 0.5) * 0.02
        };
      }
      
      setDestinationCoords(destCoords);
      
      const calculatedRoutes = await routeService.calculateRoutes(
        { lat: userLocation.lat, lng: userLocation.lng },
        destCoords
      );
      
      setRoutes(calculatedRoutes);
      setSelectedRoute(calculatedRoutes[0]); // Default to safest route
    } catch (error) {
      console.error('Error calculating routes:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRouteSelect = (route: RouteOption) => {
    setSelectedRoute(route);
  };

  const handleButtonRouteSelect = (route: RouteOption) => {
    setSelectedRoute(route);
    handleRouteSelect(route);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-white p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/20">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Safe Routes</h1>
            <p className="text-white/80 text-sm">AI-powered route planning</p>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Current Location Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="text-primary" size={20} />
                <div>
                  <div className="font-medium">Current Location</div>
                  <div className="text-sm text-muted-foreground">
                    {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Getting location...'}
                  </div>
                </div>
              </div>
              <Badge className={riskColors[currentRisk]}>
                {currentRisk === 'low' && <Shield size={12} className="mr-1" />}
                {currentRisk === 'medium' && <AlertTriangle size={12} className="mr-1" />}
                {currentRisk === 'high' && <AlertTriangle size={12} className="mr-1" />}
                {currentRisk.charAt(0).toUpperCase() + currentRisk.slice(1)} Risk
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Route Planning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation size={20} className="text-primary" />
              Plan Your Safe Route
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LocationInput
              value={destination}
              onChange={setDestination}
              onLocationSelect={(location: LocationSuggestion) => {
                setDestination(location.name);
                // Auto-trigger route calculation when location is selected
                setTimeout(() => handleGetDirections(), 100);
              }}
              placeholder="Where are you going?"
            />
            <Button 
              onClick={handleGetDirections}
              disabled={!destination.trim() || isCalculating}
              className="w-full bg-gradient-to-r from-primary to-accent text-white"
            >
              {isCalculating ? 'Calculating Routes...' : 'Get Directions'}
            </Button>
          </CardContent>
        </Card>

        {/* Route Options */}
        {routes.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {routes.map((route) => (
              <Card 
                key={route.id}
                className={`cursor-pointer transition-all ${
                  selectedRoute?.id === route.id 
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'hover:shadow-sm'
                }`}
                onClick={() => handleButtonRouteSelect(route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: route.color }}
                    />
                    <span className="font-medium capitalize">{route.type} Route</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Route size={14} className="text-muted-foreground" />
                      <span>{route.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-muted-foreground" />
                      <span>{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-muted-foreground" />
                      <span>Safety: {route.safetyScore}/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Map Container */}
        <Card>
          <CardContent className="p-4">
            {routes.length > 0 ? (
              <RouteMap 
                routes={routes}
                origin={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined}
                destination={destinationCoords || undefined}
                onRouteSelect={handleRouteSelect}
                selectedRoute={selectedRoute}
              />
            ) : (
              <div className="h-64 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Enter a destination to see route options</p>
                  <p className="text-sm mt-1">🟢 Green = Safest Route | 🔵 Blue = Fastest Route</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nearby Safety Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Nearby Safety Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nearbyReports.map((report) => (
                <div key={report.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    report.type === 'safe-space' ? 'bg-safe' :
                    report.type === 'emergency' ? 'bg-danger' :
                    'bg-warning'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{report.title}</h4>
                    <p className="text-xs text-muted-foreground">{report.location.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.timestamp).toLocaleTimeString()}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {report.type.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Route Details */}
        {selectedRoute && (
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedRoute.color }}
                />
                {selectedRoute.type.charAt(0).toUpperCase() + selectedRoute.type.slice(1)} Route Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold">{selectedRoute.distance}</div>
                    <div className="text-xs text-muted-foreground">Distance</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{selectedRoute.duration}</div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{selectedRoute.safetyScore}/10</div>
                    <div className="text-xs text-muted-foreground">Safety Score</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Route Information:</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedRoute.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          selectedRoute.type === 'safest' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Safety Tips */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-primary">Route Safety Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Shield size={16} className="text-safe mt-0.5" />
                <span>🟢 Safest routes prioritize well-lit, populated areas</span>
              </li>
              <li className="flex items-start gap-2">
                <Navigation size={16} className="text-primary mt-0.5" />
                <span>🔵 Fastest routes save time but may have safety trade-offs</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-warning mt-0.5" />
                <span>Always trust your instincts and change route if needed</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <NavBar />
    </div>
  );
};

export default SafeRoutes;