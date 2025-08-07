import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Shield, MapPin, Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Switch } from '../components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSafety } from '../contexts/SafetyContext';
import Navigation from '../components/Navigation';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { guardianSession, startGuardianMode, stopGuardianMode } = useSafety();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });

  const handleSaveProfile = () => {
    updateProfile(editedUser);
    setIsEditDialogOpen(false);
    toast.success('Profile updated successfully');
  };

  const handleAddEmergencyContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim() || !newContact.relationship.trim()) {
      toast.error('Please fill in all contact fields');
      return;
    }

    const updatedContacts = [
      ...(user?.emergencyContacts || []),
      {
        id: Date.now().toString(),
        ...newContact
      }
    ];

    updateProfile({ emergencyContacts: updatedContacts });
    setNewContact({ name: '', phone: '', relationship: '' });
    setIsContactDialogOpen(false);
    toast.success('Emergency contact added');
  };

  const handleRemoveContact = (contactId: string) => {
    const updatedContacts = user?.emergencyContacts?.filter(c => c.id !== contactId) || [];
    updateProfile({ emergencyContacts: updatedContacts });
    toast.success('Emergency contact removed');
  };

  const handleToggleGuardianMode = () => {
    if (guardianSession?.isActive) {
      stopGuardianMode();
      toast.success('Guardian mode stopped - "I\'ve arrived safely" sent');
    } else {
      const contacts = user?.emergencyContacts?.map(c => c.phone) || [];
      if (contacts.length === 0) {
        toast.error('Please add emergency contacts first');
        return;
      }
      startGuardianMode(contacts);
      toast.success('Guardian mode activated - contacts are now watching your journey');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-white p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/20">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Profile & Settings</h1>
            <p className="text-white/80 text-sm">Manage your safety preferences</p>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="text-primary" size={20} />
                Profile Information
              </div>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={editedUser.name}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        value={editedUser.email}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        value={editedUser.phone}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Phone:</span>
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">SA ID:</span>
                <span className="font-medium">{user.idNumber.replace(/(\d{6})(\d{4})(\d{3})/, '******$2***')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Mode */}
        <Card className={guardianSession?.isActive ? 'border-safe/50 bg-safe/5' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className={guardianSession?.isActive ? 'text-safe' : 'text-primary'} size={20} />
                Guardian Mode
              </div>
              <Switch 
                checked={guardianSession?.isActive || false}
                onCheckedChange={handleToggleGuardianMode}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {guardianSession?.isActive ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-safe">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">Currently active</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Started: {guardianSession.startTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Watching: {guardianSession.guardianContacts.length} contacts
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Share your live location with trusted contacts during travel. 
                They'll be notified if you don't check in as expected.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="text-primary" size={20} />
                Emergency Contacts
              </div>
              <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus size={16} className="mr-2" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Emergency Contact</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Contact name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input
                        value={newContact.phone}
                        onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+27 82 123 4567"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Relationship</label>
                      <Input
                        value={newContact.relationship}
                        onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                        placeholder="e.g., Mother, Sister, Friend"
                      />
                    </div>
                    <Button onClick={handleAddEmergencyContact} className="w-full">
                      Add Contact
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.emergencyContacts && user.emergencyContacts.length > 0 ? (
              <div className="space-y-3">
                {user.emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">{contact.relationship}</div>
                      <div className="text-xs text-muted-foreground">{contact.phone}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContact(contact.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm">No emergency contacts added yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add trusted contacts who will be notified during emergencies
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Safety Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Safety Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Location Sharing</div>
                  <div className="text-xs text-muted-foreground">Allow real-time location tracking</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Voice Activation</div>
                  <div className="text-xs text-muted-foreground">Enable panic phrase detection</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Silent Recording</div>
                  <div className="text-xs text-muted-foreground">Auto-record during emergencies</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardHeader>
            <CardTitle>About SafeStep</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform:</span>
                <span>South Africa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Support:</span>
                <span>24/7 Available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleLogout}
        >
          Sign Out
        </Button>

        {/* South African Flag */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span>Protecting South African women</span>
            <div className="flex">
              <div className="w-4 h-3 bg-sa-green"></div>
              <div className="w-4 h-3 bg-sa-blue"></div>
              <div className="w-4 h-3 bg-sa-red"></div>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Profile;