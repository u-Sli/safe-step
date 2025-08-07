import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Shield, Clock, AlertTriangle, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useSafety } from '../contexts/SafetyContext';
import Navigation from '../components/Navigation';
import EmergencyButton from '../components/EmergencyButton';
import safestepLogo from '../assets/safestep-logo.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { guardianSession, getCurrentLocationRisk, safetyReports } = useSafety();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const currentRisk = getCurrentLocationRisk();
  const recentReports = safetyReports.slice(0, 3);

  const riskColors = {
    low: 'bg-safe text-white',
    medium: 'bg-warning text-warning-foreground',
    high: 'bg-danger text-white'
  };

  const riskLabels = {
    low: 'Safe Area',
    medium: 'Moderate Risk',
    high: 'High Risk'
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary-glow to-accent text-white p-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={safestepLogo} alt="SafeStep" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h1>
              <p className="text-white/80 text-sm">Stay safe, stay connected</p>
            </div>
          </div>
          <Badge className={`${riskColors[currentRisk]} border-none`}>
            <MapPin size={12} className="mr-1" />
            {riskLabels[currentRisk]}
          </Badge>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Emergency Section */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Emergency Help</h2>
            <EmergencyButton size="lg" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/safe-routes')}
                className="flex items-center gap-2"
              >
                <MapPin size={16} />
                Safe Routes
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/chat')}
                className="flex items-center gap-2"
              >
                <MessageCircle size={16} />
                AI Assistant
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Mode Status */}
        {guardianSession?.isActive && (
          <Card className="border-safe/20 bg-safe/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-safe">
                <Shield size={18} />
                Guardian Mode Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Started:</span>
                  <span>{guardianSession.startTime.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Watching:</span>
                  <span>{guardianSession.guardianContacts.length} contacts</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => navigate('/profile')}
                >
                  Manage Guardian Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/community')}>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm">Community</h3>
              <p className="text-xs text-muted-foreground">Share & view reports</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/emergency')}>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-warning" />
              <h3 className="font-semibold text-sm">Safety Tools</h3>
              <p className="text-xs text-muted-foreground">Fake call & more</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Community Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Reports</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/community')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
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
                        {report.upvotes} upvotes
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* South African Flag Footer */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <span>Proudly South African</span>
            <div className="flex">
              <div className="w-3 h-2 bg-sa-green"></div>
              <div className="w-3 h-2 bg-sa-blue"></div>
              <div className="w-3 h-2 bg-sa-red"></div>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Dashboard;