import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Navigation,
  Phone,
  Share2,
  Timer,
  CheckCircle,
  AlertTriangle,
  Plus,
  X,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Guardian {
  id: string;
  name: string;
  phone: string;
  isActive: boolean;
  lastSeen?: string;
}

interface Trip {
  id: string;
  destination: string;
  startTime: Date;
  estimatedArrival: Date;
  status: 'active' | 'completed' | 'overdue';
  guardians: string[];
}

interface GuardianModeProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

const GuardianMode = ({ isActive, onToggle }: GuardianModeProps) => {
  const [guardians, setGuardians] = useState<Guardian[]>([
    { id: '1', name: 'Mom', phone: '+27 82 123 4567', isActive: true, lastSeen: '2 min ago' },
    { id: '2', name: 'Sister Sarah', phone: '+27 83 987 6543', isActive: false },
    { id: '3', name: 'Best Friend Lisa', phone: '+27 84 555 1234', isActive: true, lastSeen: '5 min ago' }
  ]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [newGuardian, setNewGuardian] = useState({ name: '', phone: '' });
  const [showAddGuardian, setShowAddGuardian] = useState(false);
  const [checkInTimer, setCheckInTimer] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (isActive && checkInTimer > 0) {
      const timer = setTimeout(() => setCheckInTimer(checkInTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isActive && checkInTimer === 0 && currentTrip) {
      // Trigger check-in reminder
      toast({
        title: "⏰ Check-in Reminder",
        description: "Please confirm you're safe or we'll alert your guardians",
        variant: "destructive"
      });
      setCheckInTimer(300); // Reset to 5 minutes
    }
  }, [isActive, checkInTimer, currentTrip]);

  const startGuardianMode = () => {
    const destination = prompt("Where are you going?");
    if (!destination) return;

    const estimatedMinutes = parseInt(prompt("Estimated travel time (minutes)?") || "30");
    
    const trip: Trip = {
      id: Date.now().toString(),
      destination,
      startTime: new Date(),
      estimatedArrival: new Date(Date.now() + estimatedMinutes * 60000),
      status: 'active',
      guardians: guardians.filter(g => g.isActive).map(g => g.id)
    };

    setCurrentTrip(trip);
    setCheckInTimer(300); // 5 minutes
    onToggle(true);

    // Notify guardians
    const activeGuardians = guardians.filter(g => g.isActive);
    toast({
      title: "👁️ Guardian Mode Active",
      description: `${activeGuardians.length} guardians are now tracking your journey to ${destination}`,
    });
  };

  const stopGuardianMode = () => {
    if (currentTrip) {
      setCurrentTrip(prev => prev ? { ...prev, status: 'completed' } : null);
      
      toast({
        title: "✅ Arrived Safely",
        description: "Guardians have been notified of your safe arrival",
      });
    }
    
    onToggle(false);
    setCheckInTimer(0);
  };

  const sendCheckIn = () => {
    setCheckInTimer(300); // Reset timer
    toast({
      title: "✅ Check-in Sent",
      description: "Guardians notified that you're safe",
    });
  };

  const toggleGuardian = (guardianId: string) => {
    setGuardians(prev => prev.map(g => 
      g.id === guardianId ? { ...g, isActive: !g.isActive } : g
    ));
  };

  const addGuardian = () => {
    if (!newGuardian.name.trim() || !newGuardian.phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and phone number",
        variant: "destructive"
      });
      return;
    }

    const guardian: Guardian = {
      id: Date.now().toString(),
      name: newGuardian.name,
      phone: newGuardian.phone,
      isActive: false
    };

    setGuardians(prev => [...prev, guardian]);
    setNewGuardian({ name: '', phone: '' });
    setShowAddGuardian(false);
    
    toast({
      title: "👥 Guardian Added",
      description: `${guardian.name} has been added to your guardians list`,
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Guardian Mode Status */}
      <Card className={`shadow-strong ${isActive ? 'border-success bg-success/10' : 'border-muted'}`}>
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Eye className={`w-16 h-16 mx-auto ${isActive ? 'text-success animate-pulse' : 'text-muted-foreground'}`} />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Guardian Mode {isActive ? 'Active' : 'Inactive'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {isActive 
              ? "Your trusted contacts are tracking your journey" 
              : "Share your live location with trusted contacts while traveling"
            }
          </p>
          
          {!isActive ? (
            <Button onClick={startGuardianMode} variant="success" size="lg">
              <Eye className="w-5 h-5 mr-2" />
              Start Guardian Mode
            </Button>
          ) : (
            <div className="space-y-3">
              <Button onClick={stopGuardianMode} variant="destructive" size="lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                I've Arrived Safely
              </Button>
              <Button onClick={sendCheckIn} variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Send Check-in
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Trip Info */}
      {currentTrip && isActive && (
        <Card className="shadow-soft border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <Navigation className="w-5 h-5" />
              Current Trip
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Destination:</span>
              <span className="font-medium">{currentTrip.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Started:</span>
              <span className="font-medium">
                {currentTrip.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ETA:</span>
              <span className="font-medium">
                {currentTrip.estimatedArrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Check-in:</span>
              <Badge variant="outline" className="bg-warning text-warning-foreground">
                <Timer className="w-3 h-3 mr-1" />
                {formatTime(checkInTimer)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guardians List */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              My Guardians
            </CardTitle>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowAddGuardian(!showAddGuardian)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Add Guardian Form */}
          {showAddGuardian && (
            <Card className="border-primary/20 animate-slide-up">
              <CardContent className="p-4 space-y-3">
                <Input
                  placeholder="Guardian name"
                  value={newGuardian.name}
                  onChange={(e) => setNewGuardian(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Phone number (+27 XX XXX XXXX)"
                  value={newGuardian.phone}
                  onChange={(e) => setNewGuardian(prev => ({ ...prev, phone: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Button onClick={addGuardian} variant="hero" size="sm" className="flex-1">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Guardian
                  </Button>
                  <Button 
                    onClick={() => setShowAddGuardian(false)} 
                    variant="outline" 
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Guardians */}
          {guardians.map((guardian) => (
            <div key={guardian.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${guardian.isActive ? 'bg-success' : 'bg-muted'}`}></div>
                <div>
                  <div className="font-medium">{guardian.name}</div>
                  <div className="text-sm text-muted-foreground">{guardian.phone}</div>
                  {guardian.lastSeen && guardian.isActive && (
                    <div className="text-xs text-success">Last seen: {guardian.lastSeen}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={guardian.isActive ? "default" : "outline"}>
                  {guardian.isActive ? "Active" : "Inactive"}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleGuardian(guardian.id)}
                >
                  {guardian.isActive ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-50" />}
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Guardian Features */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Guardian Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <MapPin className="w-6 h-6 text-success mx-auto mb-2" />
              <div className="text-sm font-medium">Live Location</div>
              <div className="text-xs text-muted-foreground">Real-time GPS tracking</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Clock className="w-6 h-6 text-warning mx-auto mb-2" />
              <div className="text-sm font-medium">Check-in Timer</div>
              <div className="text-xs text-muted-foreground">5-minute intervals</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <AlertTriangle className="w-6 h-6 text-danger mx-auto mb-2" />
              <div className="text-sm font-medium">Auto Alerts</div>
              <div className="text-xs text-muted-foreground">If overdue</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Share2 className="w-6 h-6 text-accent-blue mx-auto mb-2" />
              <div className="text-sm font-medium">Trip Sharing</div>
              <div className="text-xs text-muted-foreground">Route & ETA</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Guidelines */}
      <Card className="shadow-soft border-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <Heart className="w-5 h-5" />
            Guardian Mode Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Set Realistic ETAs:</strong> Add buffer time for unexpected delays</p>
            <p>• <strong>Regular Check-ins:</strong> Respond to timer notifications promptly</p>
            <p>• <strong>Keep Phone Charged:</strong> Ensure battery won't die during trip</p>
            <p>• <strong>Trust Your Guardians:</strong> They're looking out for your safety</p>
            <p>• <strong>Update Status:</strong> Let them know if plans change</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuardianMode;