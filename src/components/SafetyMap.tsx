import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Shield, 
  AlertTriangle, 
  Search,
  Route,
  Clock,
  Star,
  Zap,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SafetyZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'safe' | 'caution' | 'danger';
  description: string;
  reports: number;
  lastUpdated: string;
}

const SafetyMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [routeMode, setRouteMode] = useState<'fastest' | 'shortest' | 'safest'>('safest');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [safetyZones] = useState<SafetyZone[]>([
    {
      id: '1',
      name: 'Sandton City Mall',
      lat: -26.1076,
      lng: 28.0567,
      type: 'safe',
      description: 'Well-lit shopping area with security',
      reports: 15,
      lastUpdated: '2 hours ago'
    },
    {
      id: '2',
      name: 'Jan Smuts Avenue (Night)',
      lat: -26.1445,
      lng: 28.0400,
      type: 'caution',
      description: 'Poor lighting reported by community',
      reports: 8,
      lastUpdated: '4 hours ago'
    },
    {
      id: '3',
      name: 'Rosebank Station',
      lat: -26.1467,
      lng: 28.0400,
      type: 'safe',
      description: 'Active police presence',
      reports: 23,
      lastUpdated: '1 hour ago'
    }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate getting current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fallback to Johannesburg coordinates
          setCurrentLocation({ lat: -26.2041, lng: 28.0473 });
        }
      );
    }
  }, []);

  const startNavigation = (destination: string) => {
    toast({
      title: `🧭 Navigation Started`,
      description: `Routing to ${destination} via ${routeMode} route`,
    });
  };

  const reportIncident = (zone: SafetyZone) => {
    toast({
      title: "📝 Report Submitted",
      description: `Thank you for keeping our community safe`,
    });
  };

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'safe': return 'bg-success text-success-foreground';
      case 'caution': return 'bg-warning text-warning-foreground';
      case 'danger': return 'bg-danger text-danger-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'safe': return <Shield className="w-4 h-4" />;
      case 'caution': return <AlertTriangle className="w-4 h-4" />;
      case 'danger': return <AlertTriangle className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search & Route Options */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={routeMode === 'safest' ? 'success' : 'outline'}
                onClick={() => setRouteMode('safest')}
                className="flex-1"
              >
                <Shield className="w-4 h-4 mr-1" />
                Safest
              </Button>
              <Button
                size="sm"
                variant={routeMode === 'fastest' ? 'warning' : 'outline'}
                onClick={() => setRouteMode('fastest')}
                className="flex-1"
              >
                <Zap className="w-4 h-4 mr-1" />
                Fastest
              </Button>
              <Button
                size="sm"
                variant={routeMode === 'shortest' ? 'flagblue' : 'outline'}
                onClick={() => setRouteMode('shortest')}
                className="flex-1"
              >
                <Route className="w-4 h-4 mr-1" />
                Shortest
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card className="shadow-soft">
        <CardContent className="p-0">
          <div className="h-64 bg-gradient-to-br from-success/20 to-accent-blue/20 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="text-center z-10">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="text-lg font-medium text-primary">Interactive Safety Map</p>
              <p className="text-sm text-muted-foreground">
                Real-time safety data • Community reports • Live updates
              </p>
            </div>
            
            {/* Sample location markers */}
            <div className="absolute top-4 left-8">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            </div>
            <div className="absolute bottom-8 right-12">
              <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-12 right-6">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Route Info */}
      {searchQuery && (
        <Card className="shadow-soft border-primary/20 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Navigation className="w-5 h-5 text-primary" />
              Route to {searchQuery}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Safety Score</span>
              <Badge className="bg-success text-success-foreground">85% Safe</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Time</span>
              <span className="text-sm font-medium">18 minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Distance</span>
              <span className="text-sm font-medium">12.4 km</span>
            </div>
            <Button onClick={() => startNavigation(searchQuery)} className="w-full" variant="hero">
              <Navigation className="w-4 h-4 mr-2" />
              Start Navigation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Safety Zones */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Nearby Safety Zones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {safetyZones.map((zone) => (
            <div key={zone.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getZoneColor(zone.type)}>
                    {getZoneIcon(zone.type)}
                    {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}
                  </Badge>
                  <span className="font-medium">{zone.name}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {zone.reports}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">{zone.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated {zone.lastUpdated}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startNavigation(zone.name)}>
                    <Navigation className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => reportIncident(zone)}>
                    <AlertTriangle className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Map Legend */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-sm">Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span>Safe Zones</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span>Caution Areas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-danger rounded-full"></div>
              <span>High Risk</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyMap;