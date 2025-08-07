import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  emergencyContacts: EmergencyContact[];
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('safestep_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const validateSAID = (idNumber: string): boolean => {
    // South African ID validation
    if (idNumber.length !== 13) return false;
    
    // Extract gender digits (7-10)
    const genderDigits = parseInt(idNumber.substring(6, 10));
    
    // Only allow females (0000-4999)
    return genderDigits < 5000;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - in real app, this would be an actual API call
    try {
      // Mock successful login
      const mockUser: User = {
        id: '1',
        name: 'Sarah Johnson',
        email,
        phone: '+27 82 123 4567',
        idNumber: '9001014800083', // Mock female SA ID
        emergencyContacts: [
          {
            id: '1',
            name: 'Mom',
            phone: '+27 82 987 6543',
            relationship: 'Mother'
          }
        ]
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('safestep_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    // Validate SA ID
    if (!userData.idNumber || !validateSAID(userData.idNumber)) {
      throw new Error('Invalid South African ID or access restricted to verified women only');
    }

    try {
      // Simulate API call
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        idNumber: userData.idNumber,
        emergencyContacts: []
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('safestep_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('safestep_user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('safestep_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};