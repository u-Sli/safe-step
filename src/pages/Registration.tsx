import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import safestepLogo from '../assets/safestep-logo.png';

const Registration = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    idNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateSAID = (idNumber: string): boolean => {
    if (idNumber.length !== 13) return false;
    const genderDigits = parseInt(idNumber.substring(6, 10));
    return genderDigits < 5000; // Female only
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    // Validation
    const newErrors: string[] = [];
    
    if (!formData.name.trim()) newErrors.push('Name is required');
    if (!formData.email.includes('@')) newErrors.push('Valid email is required');
    if (!formData.phone.trim()) newErrors.push('Phone number is required');
    if (!formData.idNumber.trim()) newErrors.push('SA ID number is required');
    if (!validateSAID(formData.idNumber)) {
      newErrors.push('Invalid SA ID or access restricted to verified women only');
    }
    if (formData.password.length < 6) newErrors.push('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) newErrors.push('Passwords do not match');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const success = await register(formData, formData.password);
      if (success) {
        toast.success('Welcome to SafeStep! Your account has been created.');
        navigate('/dashboard');
      } else {
        setErrors(['Registration failed. Please try again.']);
      }
    } catch (error: any) {
      setErrors([error.message || 'Registration failed']);
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear specific errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-3">
            <img src={safestepLogo} alt="SafeStep" className="w-8 h-8" />
            <h1 className="text-xl font-bold">Join SafeStep</h1>
          </div>
        </div>

        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-primary">
              <Shield size={20} />
              Create Your Safe Account
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Verified South African women only
            </p>
          </CardHeader>
          
          <CardContent>
            {errors.length > 0 && (
              <Alert className="mb-4 border-destructive/50 text-destructive">
                <AlertDescription>
                  <ul className="space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+27 82 123 4567"
                  required
                />
              </div>

              <div>
                <Label htmlFor="idNumber" className="flex items-center gap-2">
                  SA ID Number
                  <CheckCircle size={16} className="text-primary" />
                </Label>
                <Input
                  id="idNumber"
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  placeholder="13-digit SA ID number"
                  maxLength={13}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used for gender verification (women only)
                </p>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Safe Account'}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button variant="link" className="p-0 text-primary" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* South African Flag */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span>Proudly protecting South African women</span>
            <div className="flex">
              <div className="w-4 h-3 bg-sa-green"></div>
              <div className="w-4 h-3 bg-sa-blue"></div>
              <div className="w-4 h-3 bg-sa-red"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;