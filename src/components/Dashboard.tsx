import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Shield, 
  Users, 
  Phone, 
  MessageCircle, 
  AlertTriangle, 
  Navigation, 
  Heart,
  Clock,
  Home,
  Settings,
  BookOpen,
  Battery,
  Mic,
  Camera,
  Eye,
  Star,
  Bell,
  MapIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SafetyMap from "@/components/SafetyMap";
import CommunityFeed from "@/components/CommunityFeed";
import ChatBot from "@/components/ChatBot";
import EmergencyPanel from "@/components/EmergencyPanel";
import GuardianMode from "@/components/GuardianMode";
import SafetyEducation from "@/components/SafetyEducation";
import safestepLogo from "@/assets/safestep-logo.png";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [guardianModeActive, setGuardianModeActive] = useState(false);
  const [batteryMode, setBatteryMode] = useState(false);
  const { toast } = useToast();

  const triggerFakeCall = () => {
    toast({
      title: "📞 Fake Call Activated",
      description: "Incoming call from 'Mom' in 3 seconds...",
    });
    
    setTimeout(() => {
      // Simulate phone call UI
      const audio = new Audio('/api/placeholder/fake-call-sound');
      // audio.play(); // Would play if audio file exists
      
      toast({
        title: "📱 Mom is calling...",
        description: "Tap anywhere to 'answer' and create your escape",
      });
    }, 3000);
  };

  const activatePanicPhrase = () => {
    toast({
      title: "🔒 Panic Phrase Ready",
      description: "Say 'I forgot my charger' to silently trigger SOS",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-soft sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={safestepLogo} alt="SafeStep" className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-primary text-lg">SafeStep</h1>
              <p className="text-xs text-muted-foreground">Stay Safe, Stay Strong</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {guardianModeActive && (
              <Badge variant="secondary" className="bg-success text-success-foreground">
                <Heart className="w-3 h-3 mr-1" />
                Guardian Active
              </Badge>
            )}
            {batteryMode && (
              <Badge variant="outline">
                <Battery className="w-3 h-3 mr-1" />
                Battery Save
              </Badge>
            )}
            <Button size="icon" variant="ghost">
              <Bell className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Quick Actions Bar */}
      <div className="bg-card border-b px-4 py-3">
        <div className="flex gap-2 overflow-x-auto">
          <Button 
            size="sm" 
            variant="emergency"
            className="flex-shrink-0 animate-pulse"
            onClick={() => setActiveTab("emergency")}
          >
            <AlertTriangle className="w-4 h-4" />
            SOS
          </Button>
          <Button 
            size="sm" 
            variant="flagblue"
            onClick={triggerFakeCall}
            className="flex-shrink-0"
          >
            <Phone className="w-4 h-4" />
            Fake Call
          </Button>
          <Button 
            size="sm" 
            variant="warning"
            onClick={activatePanicPhrase}
            className="flex-shrink-0"
          >
            <Mic className="w-4 h-4" />
            Panic Phrase
          </Button>
          <Button 
            size="sm" 
            variant="success"
            onClick={() => setActiveTab("guardian")}
            className="flex-shrink-0"
          >
            <Eye className="w-4 h-4" />
            Guardian
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t z-40">
            <TabsList className="grid w-full grid-cols-6 h-16 bg-transparent">
              <TabsTrigger value="home" className="flex-col gap-1 data-[state=active]:bg-primary/10">
                <Home className="w-4 h-4" />
                <span className="text-xs">Home</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex-col gap-1 data-[state=active]:bg-success/10">
                <MapIcon className="w-4 h-4" />
                <span className="text-xs">Map</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex-col gap-1 data-[state=active]:bg-accent-blue/10">
                <Users className="w-4 h-4" />
                <span className="text-xs">Community</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-col gap-1 data-[state=active]:bg-secondary/10">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">AI Chat</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="flex-col gap-1 data-[state=active]:bg-warning/10">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs">Learn</span>
              </TabsTrigger>
              <TabsTrigger value="guardian" className="flex-col gap-1 data-[state=active]:bg-danger/10">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Guardian</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="pb-20">
            <TabsContent value="home" className="mt-0">
              <div className="p-4 space-y-4">
                {/* Welcome Card */}
                <Card className="bg-gradient-primary text-white border-0 shadow-strong">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold mb-2">Good morning, Sarah! 🌅</h2>
                        <p className="opacity-90">Stay safe out there today</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">78%</div>
                        <div className="text-sm opacity-90">Safety Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="shadow-soft">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-success">12</div>
                      <div className="text-sm text-muted-foreground">Safe trips today</div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-soft">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-accent-blue">847</div>
                      <div className="text-sm text-muted-foreground">Community members</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm">Safe route completed - Sandton to Rosebank</span>
                      <span className="text-xs text-muted-foreground ml-auto">2h ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-sm">Community alert: Poor lighting on Jan Smuts Ave</span>
                      <span className="text-xs text-muted-foreground ml-auto">4h ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Guardian mode: Trip shared with Mom</span>
                      <span className="text-xs text-muted-foreground ml-auto">6h ago</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Safety Tips */}
                <Card className="shadow-soft border-secondary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-secondary" />
                      Daily Safety Tip
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      💡 Always trust your instincts. If something feels off about a situation or location, 
                      it's better to be safe and find an alternative route or ask for help.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <SafetyMap />
            </TabsContent>

            <TabsContent value="community" className="mt-0">
              <CommunityFeed />
            </TabsContent>

            <TabsContent value="chat" className="mt-0">
              <ChatBot />
            </TabsContent>

            <TabsContent value="education" className="mt-0">
              <SafetyEducation />
            </TabsContent>

            <TabsContent value="guardian" className="mt-0">
              <GuardianMode 
                isActive={guardianModeActive}
                onToggle={setGuardianModeActive}
              />
            </TabsContent>

            <TabsContent value="emergency" className="mt-0">
              <EmergencyPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;