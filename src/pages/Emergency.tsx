import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, Shield, Volume2, Clock, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../contexts/SafetyContext';
import { useAuth } from '../contexts/AuthContext';
import EmergencyButton from '../components/EmergencyButton';
import Navigation from '../components/Navigation';
import { toast } from 'sonner';

const Emergency = () => {
  const navigate = useNavigate();
  const { isEmergencyMode, userLocation } = useSafety();
  const { user } = useAuth();
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [panicPhraseEnabled, setPanicPhraseEnabled] = useState(true);
  const [batteryMode, setBatteryMode] = useState(false);

  // Fake Call Simulation
  const handleFakeCall = () => {
    setFakeCallActive(true);
    toast.success('Fake call started - "Mom" calling...');
    
    // Simulate call ending after 30 seconds
    setTimeout(() => {
      setFakeCallActive(false);
      toast.info('Fake call ended');
    }, 30000);
  };

  const endFakeCall = () => {
    setFakeCallActive(false);
    toast.info('Fake call ended');
  };

  // Mock Battery Level
  const [batteryLevel, setBatteryLevel] = useState(78);

  useEffect(() => {
    // Simulate battery drain in battery mode
    if (batteryMode) {
      toast.info('Battery saving mode enabled - reduced functionality');
    }
  }, [batteryMode]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Emergency Alert Banner */}
      {isEmergencyMode && (
        <div className="bg-danger text-white p-4 text-center animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <Shield size={20} />
            <span className="font-semibold">EMERGENCY MODE ACTIVE</span>
          </div>
          <p className="text-sm">Your location is being shared with emergency contacts</p>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-danger via-warning to-accent text-white p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/20">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Emergency Tools</h1>
            <p className="text-white/80 text-sm">Quick access safety features</p>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Main Emergency Button */}
        <Card className="text-center bg-gradient-to-br from-primary/5 to-danger/5">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Emergency SOS</h2>
            <EmergencyButton size="lg" />
            {isEmergencyMode && (
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2 text-danger">
                  <MapPin size={16} />
                  <span>Location: {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Getting...'}</span>
                </div>
                <div className="text-muted-foreground">
                  Emergency contacts notified • Authorities alerted
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fake Call Feature */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="text-primary" size={20} />
              Fake Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fakeCallActive ? (
              <div className="text-center p-6 bg-gradient-to-br from-safe/10 to-primary/10 rounded-lg">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center animate-pulse">
                  <Phone className="text-white" size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Mom Calling...</h3>
                <p className="text-muted-foreground mb-4">Incoming call simulation active</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="destructive" onClick={endFakeCall}>
                    End Call
                  </Button>
                  <Button variant="outline">
                    <Volume2 size={16} className="mr-2" />
                    Mute
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Simulate a realistic phone call to escape uncomfortable situations safely.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleFakeCall} className="bg-safe hover:bg-safe/90 text-white">
                    Call "Mom"
                  </Button>
                  <Button onClick={handleFakeCall} variant="outline">
                    Call "Friend"
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panic Phrase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="text-warning" size={20} />
                Panic Phrase
              </div>
              <Switch 
                checked={panicPhraseEnabled} 
                onCheckedChange={setPanicPhraseEnabled}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Say your secret phrase to silently activate emergency mode.
              </p>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Current phrase:</div>
                <div className="text-primary font-semibold">"I forgot my charger"</div>
              </div>
              {panicPhraseEnabled && (
                <div className="text-xs text-safe flex items-center gap-1">
                  <Shield size={12} />
                  <span>Listening for phrase activation</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Battery & Offline Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="text-accent" size={20} />
                Battery Saving Mode
              </div>
              <Switch 
                checked={batteryMode} 
                onCheckedChange={setBatteryMode}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current battery:</span>
                <span className={`text-sm font-semibold ${batteryLevel < 20 ? 'text-danger' : 'text-foreground'}`}>
                  {batteryLevel}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    batteryLevel < 20 ? 'bg-danger' : 
                    batteryLevel < 50 ? 'bg-warning' : 'bg-safe'
                  }`}
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {batteryMode 
                  ? 'Lightweight mode active - SOS and tracking still enabled' 
                  : 'Enable to extend battery life during emergencies'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {user?.emergencyContacts && user.emergencyContacts.length > 0 ? (
              <div className="space-y-3">
                {user.emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">{contact.relationship}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{contact.phone}</div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/profile')}>
                  Manage Contacts
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No emergency contacts added yet</p>
                <Button onClick={() => navigate('/profile')}>
                  Add Emergency Contacts
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offline Features */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-accent">Offline Safety Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-safe mt-0.5" />
                <span>Offline maps with safe zones (police stations, clinics)</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="text-primary mt-0.5" />
                <span>SMS-based emergency alerts using last known location</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield size={16} className="text-warning mt-0.5" />
                <span>Offline incident journal for later reporting</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Emergency;