import React, { useState } from 'react';
import { ArrowLeft, Plus, MapPin, ThumbsUp, AlertTriangle, Shield, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../contexts/SafetyContext';
import Navigation from '../components/Navigation';
import { toast } from 'sonner';

const Community = () => {
  const navigate = useNavigate();
  const { safetyReports, addSafetyReport, upvoteReport } = useSafety();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    type: '' as 'harassment' | 'poor-lighting' | 'suspicious-activity' | 'safe-space' | 'emergency',
    title: '',
    description: '',
    location: {
      lat: -33.9249,
      lng: 18.4241,
      address: ''
    }
  });

  const reportTypes = [
    { value: 'safe-space', label: 'Safe Space', icon: Shield, color: 'bg-safe' },
    { value: 'poor-lighting', label: 'Poor Lighting', icon: AlertTriangle, color: 'bg-warning' },
    { value: 'suspicious-activity', label: 'Suspicious Activity', icon: AlertTriangle, color: 'bg-warning' },
    { value: 'harassment', label: 'Harassment', icon: AlertTriangle, color: 'bg-danger' },
    { value: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'bg-danger' }
  ];

  const handleSubmitReport = () => {
    if (!newReport.type || !newReport.title.trim() || !newReport.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    addSafetyReport(newReport);
    toast.success('Safety report submitted successfully');
    setIsReportDialogOpen(false);
    setNewReport({
      type: '' as any,
      title: '',
      description: '',
      location: {
        lat: -33.9249,
        lng: 18.4241,
        address: ''
      }
    });
  };

  const handleUpvote = (reportId: string) => {
    upvoteReport(reportId);
    toast.success('Thank you for validating this report');
  };

  const getReportTypeInfo = (type: string) => {
    return reportTypes.find(t => t.value === type) || reportTypes[0];
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary-glow to-accent text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/20">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Community Safety</h1>
              <p className="text-white/80 text-sm">Share experiences, stay informed</p>
            </div>
          </div>
          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="icon" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <Plus size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Safety Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Report Type *</label>
                  <Select value={newReport.type} onValueChange={(value: any) => setNewReport(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${type.color}`} />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={newReport.title}
                    onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of the situation"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    value={newReport.description}
                    onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide more details to help other women stay safe"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={newReport.location.address}
                    onChange={(e) => setNewReport(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, address: e.target.value }
                    }))}
                    placeholder="Street name or landmark"
                  />
                </div>

                <Button onClick={handleSubmitReport} className="w-full">
                  Submit Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Community Stats */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{safetyReports.length}</div>
                <div className="text-xs text-muted-foreground">Total Reports</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-safe">
                  {safetyReports.filter(r => r.type === 'safe-space').length}
                </div>
                <div className="text-xs text-muted-foreground">Safe Spaces</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">24/7</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="text-primary" size={20} />
              Recent Reports
            </h2>
            <Badge variant="secondary">
              {safetyReports.length} active
            </Badge>
          </div>

          {safetyReports.map((report) => {
            const typeInfo = getReportTypeInfo(report.type);
            const Icon = typeInfo.icon;
            
            return (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full ${typeInfo.color} flex items-center justify-center text-white`}>
                      <Icon size={20} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-sm">{report.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            by {report.userName} • {formatTimeAgo(report.timestamp)}
                          </p>
                        </div>
                        {report.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm mt-2 text-foreground/80">
                        {report.description}
                      </p>

                      {report.location.address && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <MapPin size={12} />
                          {report.location.address}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="outline" className="text-xs">
                          {typeInfo.label}
                        </Badge>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpvote(report.id)}
                          className="flex items-center gap-1 text-xs"
                        >
                          <ThumbsUp size={12} />
                          {report.upvotes}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Community Guidelines */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Shield size={16} className="text-safe mt-0.5" />
                <span>Only verified women can contribute to maintain a safe space</span>
              </li>
              <li className="flex items-start gap-2">
                <Users size={16} className="text-primary mt-0.5" />
                <span>Help validate reports by upvoting accurate information</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-warning mt-0.5" />
                <span>Report any inappropriate content immediately</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Community;