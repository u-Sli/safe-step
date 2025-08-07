import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, MapPin, Users, MessageCircle, Phone, AlertTriangle, Heart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthPage from "@/components/AuthPage";
import Dashboard from "@/components/Dashboard";
// import saFlagBg from "@/assets/sa-flag-bg.jpg";
import safestepLogo from "@/assets/safestep-logo.png";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  if (showAuth) {
    return <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} onBack={() => setShowAuth(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with SA Flag */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-hero opacity-40"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <img src={safestepLogo} alt="SafeStep Logo" className="w-24 h-24 mx-auto mb-6 drop-shadow-lg" />
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              Safe<span className="text-secondary">Step</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              Your trusted companion for safer journeys. Exclusively for women in South Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="xl" 
                variant="hero"
                onClick={() => setShowAuth(true)}
                className="animate-slide-up"
              >
                <Shield className="w-6 h-6" />
                Get Started - Join SafeStep
              </Button>
              <Button 
                size="xl" 
                variant="secondary"
                className="animate-slide-up"
                style={{ animationDelay: '0.1s' }}
              >
                <Heart className="w-6 h-6" />
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-8 text-white">
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm opacity-90">Protection</div>
          </div>
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="text-3xl font-bold">100%</div>
            <div className="text-sm opacity-90">Women Only</div>
          </div>
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="text-3xl font-bold">SA</div>
            <div className="text-sm opacity-90">Verified</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Your Safety, Our Priority
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced AI-powered safety features designed specifically for South African women
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <Card className="shadow-soft hover:shadow-strong transition-all duration-300 border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-primary">SA ID Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Secure women-only platform using South African ID validation system
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-strong transition-all duration-300 border-success/20">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-safety rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-success">Smart Safe Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI-powered route optimization with real-time safety data and community reports
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-strong transition-all duration-300 border-danger/20">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-emergency rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-danger">Emergency SOS</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Instant emergency alerts with GPS location to contacts and authorities
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-strong transition-all duration-300 border-accent-blue/20">
              <CardHeader>
                <div className="w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-accent-blue">Community Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with verified women, share safety reports, and build support networks
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-strong transition-all duration-300 border-secondary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-secondary-foreground">AI Safety Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  24/7 AI chatbot for safety advice, emergency protocols, and support
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-strong transition-all duration-300 border-warning/20">
              <CardHeader>
                <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-warning-foreground" />
                </div>
                <CardTitle className="text-warning-foreground">Smart Features</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fake calls, panic phrases, guardian mode, and offline emergency capabilities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join the SafeStep Community
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Be part of South Africa's largest verified women's safety network
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              variant="secondary"
              onClick={() => setShowAuth(true)}
            >
              <Shield className="w-6 h-6" />
              Sign Up Now
            </Button>
            <Button 
              size="xl" 
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <Star className="w-6 h-6" />
              Download App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={safestepLogo} alt="SafeStep" className="w-8 h-8" />
            <span className="text-2xl font-bold">SafeStep</span>
          </div>
          <p className="text-primary-foreground/80">
            Empowering women's safety across South Africa • Built with ❤️ for our sisters
          </p>
          <div className="mt-6 text-sm text-primary-foreground/60">
            Proudly South African 🇿🇦 • Women-Only Platform • AI-Powered Safety
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;