import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Shield, MapPin, Phone, AlertTriangle, ExternalLink, Mic, MicOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSafety } from '../contexts/SafetyContext';
import Navigation from '../components/Navigation';
import { geminiChatAPI, type APIResponse } from '../services/geminiAPI';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  suggestions?: string[];
  actions?: Array<{
    type: 'emergency' | 'location' | 'report' | 'tips';
    label: string;
    data?: any;
  }>;
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
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true; // Keep listening
      recognitionInstance.interimResults = true; // Show real-time results
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        console.log('🎤 Voice recognition started');
      };
      
      recognitionInstance.onresult = (event: any) => {
        let transcript = '';
        
        // Get all recognized text (both interim and final)
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        // Type directly in input field as user speaks
        setInputMessage(transcript);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('🚫 Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          console.log('No speech detected, continuing...');
        } else {
          setIsListening(false);
        }
      };
      
      recognitionInstance.onend = () => {
        console.log('🛑 Voice recognition ended');
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Update user context based on location risk
  useEffect(() => {
    const risk = getCurrentLocationRisk();
    geminiChatAPI.updateUserContext({ riskLevel: risk });
  }, [getCurrentLocationRisk]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Convert messages to API format
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
        timestamp: msg.timestamp
      }));

      const response = await geminiChatAPI.sendMessage(currentInput);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.message,
        timestamp: new Date(),
        confidence: response.confidence,
        suggestions: response.suggestions,
        actions: response.actions
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm having trouble connecting right now. Please try again or use the emergency button if you need immediate help.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: any) => {
    switch (action.type) {
      case 'emergency':
        if (action.data?.action === 'sos') {
          activateEmergency();
        } else if (action.data?.action === 'mark_safe') {
          geminiChatAPI.resetEmergencyMode();
          setInputMessage("I'm safe now");
        }
        break;
      case 'location':
        if (action.data?.action === 'share_location') {
          // Trigger location sharing
          setInputMessage("Share my location with emergency contacts");
        }
        break;
      case 'report':
        navigate('/community');
        break;
      case 'tips':
        setInputMessage("Give me more safety tips");
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const toggleVoiceRecognition = () => {
    if (!recognition) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
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
                    
                    {/* Confidence indicator for AI responses */}
                    {message.type === 'assistant' && message.confidence && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Confidence: {Math.round(message.confidence * 100)}%
                        </Badge>
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.actions.map((action, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant="outline"
                            onClick={() => handleActionClick(action)}
                            className="text-xs h-7"
                          >
                            {action.label}
                            <ExternalLink size={12} className="ml-1" />
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Quick suggestions:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs h-6 px-2 text-primary hover:bg-primary/10"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
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
            placeholder={isListening ? "Listening..." : "Type or speak your message..."}
            className="flex-1"
            disabled={isListening}
          />
          <Button 
            onClick={toggleVoiceRecognition}
            disabled={isTyping}
            className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
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