import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Shield, MapPin, Phone, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSafety } from '../contexts/SafetyContext';
import Navigation from '../components/Navigation';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCurrentLocationRisk, userLocation, activateEmergency } = useSafety();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your SafeStep AI assistant. I'm here to help with safety advice, route planning, emergency guidance, and any concerns you might have. How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const safetyResponses = {
    emergency: [
      "I understand you might be in a dangerous situation. If you're in immediate danger, please use the emergency SOS button or call 10111 (SAPS) immediately.",
      "Your safety is the priority. If you feel unsafe, trust your instincts. Would you like me to help you activate emergency mode or find the nearest safe location?"
    ],
    route: [
      "I can help you plan a safer route! Based on current community reports, I recommend avoiding poorly lit areas and staying on main roads when possible.",
      "For route planning, consider these safety factors: good lighting, populated areas, proximity to police stations or safe spaces. Would you like specific route suggestions?"
    ],
    harassment: [
      "I'm sorry you're experiencing this. Your safety matters. Document everything if safe to do so, trust your instincts, and don't hesitate to report incidents.",
      "Harassment is never acceptable. Consider using the fake call feature to exit uncomfortable situations, and always prioritize getting to a safe, public space."
    ],
    support: [
      "Remember, you're not alone in this. The SafeStep community is here to support each other. You're brave for prioritizing your safety.",
      "You have the right to feel safe. Trust your instincts, stay alert, and remember that seeking help is always the right choice."
    ]
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Emergency keywords
    if (message.includes('emergency') || message.includes('danger') || message.includes('help') || message.includes('scared')) {
      return safetyResponses.emergency[Math.floor(Math.random() * safetyResponses.emergency.length)];
    }
    
    // Route planning
    if (message.includes('route') || message.includes('directions') || message.includes('safe path') || message.includes('way to')) {
      return safetyResponses.route[Math.floor(Math.random() * safetyResponses.route.length)];
    }
    
    // Harassment/safety concerns
    if (message.includes('harassment') || message.includes('following') || message.includes('uncomfortable') || message.includes('catcall')) {
      return safetyResponses.harassment[Math.floor(Math.random() * safetyResponses.harassment.length)];
    }
    
    // Location-based responses
    if (message.includes('location') || message.includes('where') || message.includes('area')) {
      const risk = getCurrentLocationRisk();
      return `Based on community reports, your current area has ${risk} risk level. ${
        risk === 'high' ? 'Consider finding a well-lit, populated area or contacting someone you trust.' :
        risk === 'medium' ? 'Stay alert and consider having someone track your location.' :
        'This appears to be a relatively safe area, but always stay aware of your surroundings.'
      }`;
    }
    
    // General safety tips
    if (message.includes('tip') || message.includes('advice') || message.includes('safe')) {
      const tips = [
        "Always let someone know your plans and expected arrival time. Use Guardian Mode to share your live location with trusted contacts.",
        "Trust your instincts - if something feels wrong, it probably is. Don't worry about being polite if you feel unsafe.",
        "Keep your phone charged and have emergency contacts readily available. Consider carrying a portable charger.",
        "Stay in well-lit, populated areas when possible. Avoid wearing headphones that completely block out surrounding sounds.",
        "Have a plan before you leave. Know where the nearest police stations, hospitals, and safe spaces are located."
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    // Default supportive response
    return safetyResponses.support[Math.floor(Math.random() * safetyResponses.support.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      icon: Shield,
      label: 'Emergency Help',
      action: () => setInputMessage('I need emergency help'),
      color: 'text-danger'
    },
    {
      icon: MapPin,
      label: 'Route Safety',
      action: () => setInputMessage('Help me plan a safe route'),
      color: 'text-primary'
    },
    {
      icon: Phone,
      label: 'Report Incident',
      action: () => setInputMessage('I want to report a safety incident'),
      color: 'text-warning'
    },
    {
      icon: AlertTriangle,
      label: 'Safety Tips',
      action: () => setInputMessage('Give me safety tips for walking alone'),
      color: 'text-accent'
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/20">
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Safety Assistant</h1>
              <p className="text-white/80 text-sm">Always here to help keep you safe</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Card className={`max-w-[80%] ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-primary to-primary-glow text-white' 
                : 'bg-card'
            }`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  {message.type === 'assistant' && (
                    <Bot size={20} className="text-primary mt-0.5" />
                  )}
                  {message.type === 'user' && (
                    <User size={20} className="text-white mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <span className={`text-xs ${
                      message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    } mt-1 block`}>
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <Card className="bg-card">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-primary" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={action.action}
              className="flex items-center gap-2 text-xs"
            >
              <action.icon size={14} className={action.color} />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-primary to-primary-glow text-white"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Chat;