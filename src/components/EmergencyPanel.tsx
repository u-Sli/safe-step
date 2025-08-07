import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Phone, 
  Shield, 
  MapPin,
  Camera,
  Mic,
  Users,
  Clock,
  Volume2,
  Siren,
  Heart,
  Navigation
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmergencyPanel = () => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (emergencyActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (emergencyActive && countdown === 0) {
      triggerEmergencyAlert();
    }
  }, [emergencyActive, countdown]);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setLocation({ lat: -26.2041, lng: 28.0473 }); // Fallback to Johannesburg
        }
      );
    }
  }, []);

  const startEmergencyCountdown = () => {
    setEmergencyActive(true);
    setCountdown(5);
    toast({
      title: "🚨 Emergency Alert Starting",
      description: "5 seconds to cancel. Press Cancel to stop.",
      variant: "destructive"
    });
  };

  const cancelEmergency = () => {
    setEmergencyActive(false);
    setCountdown(0);
    setIsRecording(false);
    toast({
      title: "Emergency Cancelled",
      description: "Emergency alert has been cancelled",
    });
  };

  const triggerEmergencyAlert = () => {
    setIsRecording(true);
    
    // Simulate emergency actions
    toast({
      title: "🚨 EMERGENCY ALERT SENT",
      description: "Contacts notified • Police alerted • Location shared",
      variant: "destructive"
    });

    // Auto-record audio/video
    setTimeout(() => {
      toast({
        title: "📹 Recording Started",
        description: "Audio and video recording for your safety",
      });
    }, 1000);
  };

  const emergencyContacts = [
    { name: "Police", number: "10111", icon: Shield, color: "bg-accent-blue" },
    { name: "Medical", number: "10177", icon: Heart, color: "bg-danger" },
    { name: "GBV Helpline", number: "0800 428 428", icon: Users, color: "bg-success" },
    { name: "Mom", number: "+27 82 123 4567", icon: Phone, color: "bg-secondary" }
  ];

  const quickActions = [
    { 
      name: "Silent SOS", 
      description: "Send alert without sound", 
      icon: Volume2, 
      action: () => {
        toast({
          title: "🔇 Silent SOS Sent",
          description: "Emergency contacts notified silently",
          variant: "destructive"
        });
      }
    },
    { 
      name: "Record Evidence", 
      description: "Start audio/video recording", 
      icon: Camera, 
      action: () => {
        setIsRecording(!isRecording);
        toast({
          title: isRecording ? "Recording Stopped" : "📹 Recording Started",
          description: isRecording ? "Evidence saved securely" : "Recording audio and video",
        });
      }
    },
    { 
      name: "Share Location", 
      description: "Send GPS to contacts", 
      icon: MapPin, 
      action: () => {
        toast({
          title: "📍 Location Shared",
          description: "Current GPS coordinates sent to emergency contacts",
        });
      }
    },
    { 
      name: "Sound Alarm", 
      description: "Loud siren sound", 
      icon: Siren, 
      action: () => {
        toast({
          title: "🚨 Alarm Activated",
          description: "Loud alarm sound to attract attention",
        });
      }
    }
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Emergency Status */}
      {emergencyActive && (
        <Card className="border-danger bg-danger/10 shadow-emergency animate-pulse-emergency">
          <CardContent className="p-4 text-center">
            <div className="text-6xl font-bold text-danger mb-2">{countdown}</div>
            <p className="text-danger font-medium mb-4">
              Emergency alert in {countdown} seconds
            </p>
            <Button onClick={cancelEmergency} variant="outline" size="lg">
              CANCEL EMERGENCY
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main SOS Button */}
      <Card className="shadow-strong">
        <CardContent className="p-8 text-center">
          <Button
            size="emergency"
            variant="emergency"
            onClick={startEmergencyCountdown}
            disabled={emergencyActive}
            className="w-32 h-32 text-2xl font-bold mb-4"
          >
            <AlertTriangle className="w-12 h-12" />
          </Button>
          <h2 className="text-2xl font-bold text-danger mb-2">Emergency SOS</h2>
          <p className="text-muted-foreground">
            Press and hold for immediate emergency alert
          </p>
        </CardContent>
      </Card>

      {/* Current Location */}
      {location && (
        <Card className="shadow-soft border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <MapPin className="w-5 h-5" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Latitude:</span>
                <span className="font-mono">{location.lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Longitude:</span>
                <span className="font-mono">{location.lng.toFixed(6)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accuracy:</span>
                <Badge variant="outline" className="bg-success text-success-foreground">
                  High Precision
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={action.action}
                className="h-auto p-4 flex flex-col gap-2"
              >
                <action.icon className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium text-xs">{action.name}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${contact.color} rounded-full flex items-center justify-center`}>
                    <contact.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">{contact.number}</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recording Status */}
      {isRecording && (
        <Card className="border-danger bg-danger/10 shadow-emergency">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-danger rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-danger">Recording Active</div>
                <div className="text-sm text-muted-foreground">Audio and video evidence being recorded</div>
              </div>
              <div className="ml-auto">
                <Badge variant="outline" className="bg-danger text-danger-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Safety Tips */}
      <Card className="shadow-soft border-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="w-5 h-5" />
            Emergency Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Stay Calm:</strong> Take deep breaths and assess the situation</p>
            <p>• <strong>Get to Safety:</strong> Move to a safe, well-lit, populated area</p>
            <p>• <strong>Call for Help:</strong> Don't hesitate to contact authorities</p>
            <p>• <strong>Document Everything:</strong> Use recording features if safe to do so</p>
            <p>• <strong>Follow Up:</strong> Report incidents to help other women stay safe</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyPanel;