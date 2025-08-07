import React, { createContext, useContext, useState, useEffect } from 'react';

interface SafetyReport {
  id: string;
  type: 'harassment' | 'poor-lighting' | 'suspicious-activity' | 'safe-space' | 'emergency';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: Date;
  userId: string;
  userName: string;
  upvotes: number;
  verified: boolean;
}

interface GuardianSession {
  id: string;
  guardianContacts: string[];
  startTime: Date;
  estimatedArrival?: Date;
  isActive: boolean;
  lastLocation?: {
    lat: number;
    lng: number;
    timestamp: Date;
  };
}

interface SafetyContextType {
  isEmergencyMode: boolean;
  guardianSession: GuardianSession | null;
  safetyReports: SafetyReport[];
  userLocation: { lat: number; lng: number } | null;
  activateEmergency: () => void;
  deactivateEmergency: () => void;
  startGuardianMode: (contacts: string[], estimatedArrival?: Date) => void;
  stopGuardianMode: () => void;
  updateLocation: (lat: number, lng: number) => void;
  addSafetyReport: (report: Omit<SafetyReport, 'id' | 'timestamp' | 'userId' | 'userName' | 'upvotes' | 'verified'>) => void;
  upvoteReport: (reportId: string) => void;
  getCurrentLocationRisk: () => 'low' | 'medium' | 'high';
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (context === undefined) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [guardianSession, setGuardianSession] = useState<GuardianSession | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>([
    // Mock data for demonstration
    {
      id: '1',
      type: 'poor-lighting',
      title: 'Dark alley on Smith Street',
      description: 'Very poor lighting after 7pm, feels unsafe walking alone',
      location: {
        lat: -33.9249,
        lng: 18.4241,
        address: 'Smith Street, Cape Town'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      userId: '2',
      userName: 'Anonymous User',
      upvotes: 5,
      verified: true
    },
    {
      id: '2',
      type: 'safe-space',
      title: 'Well-lit parking area',
      description: 'Good security and lighting, feels safe even late evening',
      location: {
        lat: -33.9279,
        lng: 18.4209,
        address: 'V&A Waterfront, Cape Town'
      },
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      userId: '3',
      userName: 'SafeWalker',
      upvotes: 12,
      verified: true
    }
  ]);

  useEffect(() => {
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Cape Town coordinates
          setUserLocation({
            lat: -33.9249,
            lng: 18.4241
          });
        }
      );
    }
  }, []);

  const activateEmergency = () => {
    setIsEmergencyMode(true);
    
    // Send emergency alerts (in real app, this would trigger SMS/calls)
    console.log('🚨 EMERGENCY ACTIVATED - Sending alerts to emergency contacts');
    
    // Simulate sending location to emergency contacts
    if (userLocation) {
      console.log(`📍 Emergency location: ${userLocation.lat}, ${userLocation.lng}`);
    }
    
    // In real app: trigger silent recording, send alerts, notify authorities
  };

  const deactivateEmergency = () => {
    setIsEmergencyMode(false);
    console.log('✅ Emergency mode deactivated');
  };

  const startGuardianMode = (contacts: string[], estimatedArrival?: Date) => {
    const session: GuardianSession = {
      id: Date.now().toString(),
      guardianContacts: contacts,
      startTime: new Date(),
      estimatedArrival,
      isActive: true,
      lastLocation: userLocation ? {
        lat: userLocation.lat,
        lng: userLocation.lng,
        timestamp: new Date()
      } : undefined
    };

    setGuardianSession(session);
    console.log('👥 Guardian mode activated', session);
  };

  const stopGuardianMode = () => {
    if (guardianSession) {
      setGuardianSession(null);
      console.log('👥 Guardian mode stopped - I have arrived safely notification sent');
    }
  };

  const updateLocation = (lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    
    // Update guardian session location if active
    if (guardianSession) {
      setGuardianSession(prev => prev ? {
        ...prev,
        lastLocation: { lat, lng, timestamp: new Date() }
      } : null);
    }
  };

  const addSafetyReport = (reportData: Omit<SafetyReport, 'id' | 'timestamp' | 'userId' | 'userName' | 'upvotes' | 'verified'>) => {
    const newReport: SafetyReport = {
      ...reportData,
      id: Date.now().toString(),
      timestamp: new Date(),
      userId: 'current-user', // In real app, get from auth context
      userName: 'Current User',
      upvotes: 0,
      verified: false
    };

    setSafetyReports(prev => [newReport, ...prev]);
  };

  const upvoteReport = (reportId: string) => {
    setSafetyReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? { ...report, upvotes: report.upvotes + 1 }
          : report
      )
    );
  };

  const getCurrentLocationRisk = (): 'low' | 'medium' | 'high' => {
    if (!userLocation) return 'medium';
    
    // Calculate risk based on nearby reports (simplified algorithm)
    const nearbyReports = safetyReports.filter(report => {
      const distance = Math.sqrt(
        Math.pow(report.location.lat - userLocation.lat, 2) +
        Math.pow(report.location.lng - userLocation.lng, 2)
      );
      return distance < 0.01; // Roughly 1km radius
    });

    const dangerousReports = nearbyReports.filter(report => 
      ['harassment', 'suspicious-activity', 'emergency'].includes(report.type)
    );

    if (dangerousReports.length > 2) return 'high';
    if (dangerousReports.length > 0) return 'medium';
    return 'low';
  };

  const value: SafetyContextType = {
    isEmergencyMode,
    guardianSession,
    safetyReports,
    userLocation,
    activateEmergency,
    deactivateEmergency,
    startGuardianMode,
    stopGuardianMode,
    updateLocation,
    addSafetyReport,
    upvoteReport,
    getCurrentLocationRisk
  };

  return (
    <SafetyContext.Provider value={value}>
      {children}
    </SafetyContext.Provider>
  );
};