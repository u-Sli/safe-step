import React, { useState } from 'react';
import { Shield, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { useSafety } from '../contexts/SafetyContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface EmergencyButtonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ 
  size = 'lg', 
  className = '' 
}) => {
  const { isEmergencyMode, activateEmergency, deactivateEmergency, userLocation } = useSafety();
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEmergencyPress = () => {
    if (isEmergencyMode) {
      deactivateEmergency();
      toast.success('Emergency mode deactivated');
      return;
    }

    setShowConfirm(true);
    
    // Auto-activate after 3 seconds of holding (simulated)
    setTimeout(() => {
      if (showConfirm) {
        activateEmergency();
        setShowConfirm(false);
        
        toast.error('🚨 EMERGENCY ACTIVATED', {
          description: 'Your location has been sent to emergency contacts and authorities.',
          duration: 5000,
        });

        // Simulate emergency actions
        console.log('🚨 EMERGENCY PROTOCOL ACTIVATED:');
        console.log('📍 Location sent to emergency contacts');
        console.log('📞 Calling emergency services');
        console.log('📹 Silent recording started');
        
        if (user?.emergencyContacts) {
          console.log('Emergency contacts notified:', user.emergencyContacts);
        }
      }
    }, 300);
  };

  const buttonSize = {
    sm: 'h-16 w-16',
    md: 'h-20 w-20',
    lg: 'h-28 w-28'
  }[size];

  const iconSize = {
    sm: 24,
    md: 28,
    lg: 36
  }[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {showConfirm && (
        <Alert className="mb-4 border-danger bg-danger/10">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Hold to activate emergency protocol...
          </AlertDescription>
        </Alert>
      )}
      
      <Button
        variant={isEmergencyMode ? "destructive" : "default"}
        size="icon"
        className={`
          ${buttonSize}
          rounded-full
          ${isEmergencyMode 
            ? 'bg-danger hover:bg-danger/90 animate-glow-pulse shadow-danger text-white' 
            : 'bg-gradient-to-br from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-primary text-primary-foreground'
          }
          transition-all duration-300 border-4 border-white shadow-xl
          active:scale-95 font-bold
        `}
        onMouseDown={handleEmergencyPress}
        onTouchStart={handleEmergencyPress}
        onMouseUp={() => setShowConfirm(false)}
        onTouchEnd={() => setShowConfirm(false)}
      >
        <div className="flex flex-col items-center">
          <Shield size={iconSize} className={isEmergencyMode ? 'animate-pulse' : ''} />
          {size === 'lg' && (
            <span className="text-xs mt-1 font-semibold">
              {isEmergencyMode ? 'ACTIVE' : 'SOS'}
            </span>
          )}
        </div>
      </Button>
      
      <p className="text-xs text-muted-foreground mt-2 text-center max-w-32">
        {isEmergencyMode ? 'Tap to deactivate' : 'Hold for emergency'}
      </p>
      
      {isEmergencyMode && (
        <div className="mt-3 space-y-2 text-center">
          <div className="flex items-center gap-2 text-xs text-danger">
            <Phone size={12} />
            <span>Emergency contacts notified</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-danger">
            <MapPin size={12} />
            <span>Location shared</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyButton;