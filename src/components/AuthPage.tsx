import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, CheckCircle, AlertCircle, User, Mail, Phone, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import safestepLogo from "@/assets/safestep-logo.png";

interface AuthPageProps {
  onAuthSuccess: () => void;
  onBack: () => void;
}

const AuthPage = ({ onAuthSuccess, onBack }: AuthPageProps) => {
  const [formData, setFormData] = useState({
    idNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    emergencyContact1: "",
    emergencyContact2: ""
  });
  const [isValidatingId, setIsValidatingId] = useState(false);
  const [idValidation, setIdValidation] = useState<{status: 'none' | 'valid' | 'invalid', message: string}>({
    status: 'none',
    message: ''
  });
  const { toast } = useToast();

  const validateSAID = (idNumber: string) => {
    // SA ID format: YYMMDDGGGGCAZ
    // Digits 7-10 (GGGG) determine gender: 0000-4999 = Female, 5000-9999 = Male
    if (idNumber.length !== 13) {
      return { isValid: false, isFemale: false, message: "SA ID must be 13 digits" };
    }

    if (!/^\d{13}$/.test(idNumber)) {
      return { isValid: false, isFemale: false, message: "SA ID must contain only numbers" };
    }

    // Extract gender digits (7-10, 0-indexed: 6-9)
    const genderDigits = parseInt(idNumber.substring(6, 10));
    const isFemale = genderDigits < 5000;

    return {
      isValid: true,
      isFemale,
      message: isFemale ? "✓ Female SA ID verified" : "Access denied: SafeStep is exclusively for women"
    };
  };

  const handleIdChange = (value: string) => {
    setFormData(prev => ({ ...prev, idNumber: value }));
    
    if (value.length === 13) {
      setIsValidatingId(true);
      setTimeout(() => {
        const validation = validateSAID(value);
        setIdValidation({
          status: validation.isValid && validation.isFemale ? 'valid' : 'invalid',
          message: validation.message
        });
        setIsValidatingId(false);
      }, 1000);
    } else {
      setIdValidation({ status: 'none', message: '' });
    }
  };

  const handleSignUp = () => {
    if (idValidation.status !== 'valid') {
      toast({
        title: "Verification Required",
        description: "Please provide a valid South African female ID number",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    // Simulate registration
    toast({
      title: "Welcome to SafeStep! 🎉",
      description: "Your account has been created successfully",
    });
    onAuthSuccess();
  };

  const handleSignIn = () => {
    toast({
      title: "Welcome back! 👋",
      description: "You're now signed in to SafeStep",
    });
    onAuthSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-strong border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img src={safestepLogo} alt="SafeStep" className="w-16 h-16" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              Join SafeStep
            </CardTitle>
            <p className="text-muted-foreground">
              South Africa's trusted women-only safety platform
            </p>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="signin">Sign In</TabsTrigger>
              </TabsList>

              <TabsContent value="signup" className="space-y-4 mt-6">
                {/* SA ID Verification */}
                <div className="space-y-2">
                  <Label htmlFor="idNumber" className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    South African ID Number
                  </Label>
                  <Input
                    id="idNumber"
                    placeholder="Enter your 13-digit SA ID"
                    value={formData.idNumber}
                    onChange={(e) => handleIdChange(e.target.value)}
                    maxLength={13}
                    className="text-center text-lg tracking-wider"
                  />
                  {isValidatingId && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      Verifying ID...
                    </div>
                  )}
                  {idValidation.status === 'valid' && (
                    <div className="flex items-center gap-2 text-sm text-success">
                      <CheckCircle className="w-4 h-4" />
                      {idValidation.message}
                    </div>
                  )}
                  {idValidation.status === 'invalid' && (
                    <div className="flex items-center gap-2 text-sm text-danger">
                      <AlertCircle className="w-4 h-4" />
                      {idValidation.message}
                    </div>
                  )}
                </div>

                {idValidation.status === 'valid' && (
                  <div className="space-y-4 animate-slide-up">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+27 XX XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Emergency Contacts</Label>
                      <Input
                        placeholder="Emergency Contact 1 (Phone)"
                        value={formData.emergencyContact1}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact1: e.target.value }))}
                      />
                      <Input
                        placeholder="Emergency Contact 2 (Phone)"
                        value={formData.emergencyContact2}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact2: e.target.value }))}
                      />
                    </div>

                    <Button onClick={handleSignUp} className="w-full" variant="hero" size="lg">
                      <Shield className="w-4 h-4 mr-2" />
                      Create SafeStep Account
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="signin" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="signin-email">Email or Phone</Label>
                  <Input
                    id="signin-email"
                    placeholder="Enter your email or phone"
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </div>
                <Button onClick={handleSignIn} className="w-full" variant="hero" size="lg">
                  <User className="w-4 h-4 mr-2" />
                  Sign In to SafeStep
                </Button>
                <Button variant="ghost" className="w-full text-primary">
                  Forgot Password?
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-white/80 text-sm">
          <p>🇿🇦 Proudly protecting South African women</p>
          <p>100% verified • 24/7 support • AI-powered safety</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;