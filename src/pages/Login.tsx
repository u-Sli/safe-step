import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import safestepLogo from '../assets/safestep-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast.success('Welcome back to SafeStep!');
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  // Demo account for testing
  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const success = await login('demo@safestep.co.za', 'demo123');
      if (success) {
        toast.success('Welcome to SafeStep demo!');
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Demo login failed');
    }
    setLoading(false);
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
            <h1 className="text-xl font-bold">Welcome Back</h1>
          </div>
        </div>

        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-primary">
              <Shield size={20} />
              Sign In to SafeStep
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your personal safety companion
            </p>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert className="mb-4 border-destructive/50 text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Button */}
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                Try Demo Account
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button variant="link" className="p-0 text-primary" onClick={() => navigate('/register')}>
                  Create Account
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* South African Flag */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span>Trusted by South African women</span>
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

export default Login;