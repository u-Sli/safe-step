import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Navigation, MapPin, AlertTriangle, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../contexts/SafetyContext';
import NavBar from '../components/Navigation';

const SafeRoutes = () => {
  const navigate = useNavigate();
  const { userLocation, safetyReports, getCurrentLocationRisk } = useSafety();
  const [destination, setDestination] = useState('');
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);

  const currentRisk = getCurrentLocationRisk();
  const nearbyReports = safetyReports.slice(0, 5);

  const riskColors = {
    low: 'bg-safe text-white',
    medium: 'bg-warning text-warning-foreground',
    high: 'bg-danger text-white'
  };

  const initializeMap = () => {
    if (!mapboxToken) {
      setShowTokenInput(true);
      return;
    }

    // In a real app, this would initialize Mapbox GL JS
    console.log('Map initialized with token:', mapboxToken);
    setShowTokenInput(false);
  };

  const handleGetDirections = () => {
    if (!destination.trim()) return;
    
    // In a real app, this would calculate routes with safety considerations
    console.log('Getting safe route to:', destination);
    console.log('Current location:', userLocation);
    console.log('Safety reports considered:', nearbyReports.length);
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
            <div>
              <Input
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleGetDirections}
                className="bg-gradient-to-r from-safe to-success text-white"
                disabled={!destination.trim()}
              >
                Safest Route
              </Button>
              <Button 
                variant="outline"
                onClick={handleGetDirections}
                disabled={!destination.trim()}
              >
                Fastest Route
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mapbox Token Input - Demo purposes */}
        {showTokenInput && (
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-accent">Map Setup Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To display interactive maps, please enter your Mapbox public token.
                Get one free at mapbox.com
              </p>
              <Input
                placeholder="Enter Mapbox public token"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button onClick={initializeMap} disabled={!mapboxToken.trim()}>
                Initialize Map
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Map Container */}
        <Card>
          <CardContent className="p-0">
            <div 
              ref={mapContainer}
              className="h-64 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center"
            >
              {showTokenInput ? (
                <div className="text-center text-muted-foreground">
                  <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Map will appear here after setup</p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Navigation size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Interactive safety map</p>
                  <p className="text-sm">Route planning with real-time safety data</p>
                </div>
              )}
            </div>
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

        {/* Safety Tips */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-primary">Route Safety Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Shield size={16} className="text-safe mt-0.5" />
                <span>Choose well-lit, populated routes when possible</span>
              </li>
              <li className="flex items-start gap-2">
                <Navigation size={16} className="text-primary mt-0.5" />
                <span>Share your route with trusted contacts</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-warning mt-0.5" />
                <span>Trust your instincts - change route if something feels wrong</span>
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