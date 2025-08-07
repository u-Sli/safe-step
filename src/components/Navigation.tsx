import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, Users, Shield, MessageCircle, User } from 'lucide-react';
import { Button } from './ui/button';
import { useSafety } from '../contexts/SafetyContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isEmergencyMode } = useSafety();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Map, label: 'Routes', path: '/safe-routes' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          
          return (
            <Button
              key={path}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive 
                  ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              } ${isEmergencyMode ? 'animate-pulse-safe' : ''}`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          );
        })}
      </div>
      
      {/* Emergency indicator */}
      {isEmergencyMode && (
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
          <div className="bg-danger text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
            <Shield size={12} className="inline mr-1" />
            Emergency Active
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;