import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, Users, Phone, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import safestepLogo from '../assets/safestep-logo.png';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Emergency SOS',
      description: 'Instant alerts to contacts and authorities with your location'
    },
    {
      icon: MapPin,
      title: 'Safe Route Planning',
      description: 'AI-powered route suggestions based on real-time safety data'
    },
    {
      icon: Users,
      title: 'Community Safety',
      description: 'Share and view safety reports from verified women in your area'
    },
    {
      icon: Phone,
      title: 'Smart Safety Tools',
      description: 'Fake calls, panic phrases, and guardian mode for protection'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Hero Section */}
      <section className="pt-12 pb-8 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <img src={safestepLogo} alt="SafeStep Logo" className="w-24 h-24 animate-slide-up" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent mb-4 animate-slide-up">
            SafeStep
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-2 animate-slide-up">
            Your Personal Safety Companion
          </p>
          
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
            An AI-powered safety app designed exclusively for South African women. 
            Navigate safer routes, connect with your community, and access emergency help when you need it most.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground shadow-primary border-0 px-8"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/login')}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose SafeStep?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-primary/20 hover:shadow-lg transition-all duration-300 animate-slide-up">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* South African Focus Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="flex">
              <div className="w-6 h-4 bg-sa-green"></div>
              <div className="w-6 h-4 bg-sa-blue"></div>
              <div className="w-6 h-4 bg-sa-red"></div>
            </div>
            <h2 className="text-2xl font-bold">Built for South African Women</h2>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            SafeStep uses South African ID verification to ensure a trusted, women-only community. 
            Our platform is designed with local safety concerns and cultural context in mind.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Women-Only Platform</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Emergency Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">AI</div>
              <div className="text-muted-foreground">Smart Safety Assistant</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Feel Safer?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of South African women who trust SafeStep for their daily safety needs.
          </p>
          
          <Button 
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white shadow-primary border-0 px-12 py-6 text-lg animate-glow-pulse"
          >
            Start Your Safe Journey
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;