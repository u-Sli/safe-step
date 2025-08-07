import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Shield, 
  Bot,
  Phone,
  MapPin,
  AlertTriangle,
  Heart,
  Lightbulb,
  Clock,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category?: 'safety' | 'emergency' | 'general' | 'support';
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm Ava, your AI safety assistant. I'm here 24/7 to help with safety advice, emergency protocols, and support. How can I help you stay safe today? 💪",
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickResponses = [
    { text: "Emergency help", icon: AlertTriangle, category: 'emergency' as const },
    { text: "Safe route advice", icon: MapPin, category: 'safety' as const },
    { text: "Self-defense tips", icon: Shield, category: 'safety' as const },
    { text: "Report incident", icon: Phone, category: 'support' as const }
  ];

  const generateBotResponse = (userMessage: string): { content: string; category: Message['category'] } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('emergency') || message.includes('help') || message.includes('danger')) {
      return {
        content: "🚨 If you're in immediate danger, please call 10111 (Police) or 10177 (Medical Emergency) right away!\n\nFor non-urgent situations, I can help you:\n• Find the nearest safe location\n• Contact your emergency contacts\n• Guide you through safety protocols\n• Connect you with support resources\n\nWhat type of help do you need?",
        category: 'emergency'
      };
    }
    
    if (message.includes('route') || message.includes('travel') || message.includes('navigation')) {
      return {
        content: "🗺️ I can help you plan a safer journey!\n\nFor safer routes, I recommend:\n• Using well-lit main roads\n• Avoiding isolated areas\n• Traveling during daylight when possible\n• Sharing your location with trusted contacts\n\nWould you like me to help you plan a specific route? Just tell me your destination!",
        category: 'safety'
      };
    }
    
    if (message.includes('self-defense') || message.includes('protection') || message.includes('defend')) {
      return {
        content: "🥋 Here are key self-defense principles:\n\n1. **Awareness**: Stay alert to your surroundings\n2. **Confidence**: Walk with purpose and confidence\n3. **Escape**: Your goal is to get away safely\n4. **Voice**: Don't hesitate to scream for help\n5. **Vital points**: Target eyes, nose, groin if attacked\n\nRemember: Your safety is more valuable than any possession. Would you like specific techniques or situational advice?",
        category: 'safety'
      };
    }
    
    if (message.includes('report') || message.includes('incident')) {
      return {
        content: "📝 I can help you report incidents:\n\n**For immediate crimes**: Call 10111\n**For gender-based violence**: Call 0800 428 428\n**For SafeStep community reports**: Use our in-app reporting\n\nTo file a community report:\n1. Go to Community Feed\n2. Tap the + button\n3. Select 'Incident'\n4. Provide details and location\n\nYour reports help keep all women safer. What would you like to report?",
        category: 'support'
      };
    }
    
    if (message.includes('scared') || message.includes('afraid') || message.includes('worried')) {
      return {
        content: "💕 It's completely normal to feel scared sometimes. You're being smart by thinking about your safety.\n\nImmediate comfort measures:\n• Take deep breaths\n• Move to a well-lit, populated area\n• Contact a trusted friend or family member\n• Use SafeStep's Guardian Mode to share your location\n\nRemember: You're part of a strong community of women who support each other. Is there something specific that's worrying you?",
        category: 'support'
      };
    }
    
    // General responses
    const responses = [
      {
        content: "I'm here to help you stay safe! I can provide safety advice, emergency guidance, or just chat if you need support. What's on your mind?",
        category: 'general' as const
      },
      {
        content: "Safety is my priority! Whether you need route planning, emergency protocols, or self-defense tips, I'm here for you 24/7. How can I assist?",
        category: 'safety' as const
      },
      {
        content: "As your AI safety companion, I'm equipped to help with various situations. Feel free to ask about anything safety-related or just chat! 💜",
        category: 'general' as const
      }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const response = generateBotResponse(content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        category: response.category
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getCategoryColor = (category: Message['category']) => {
    switch (category) {
      case 'emergency': return 'bg-danger text-danger-foreground';
      case 'safety': return 'bg-success text-success-foreground';
      case 'support': return 'bg-accent-blue text-accent-blue-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getCategoryIcon = (category: Message['category']) => {
    switch (category) {
      case 'emergency': return <AlertTriangle className="w-3 h-3" />;
      case 'safety': return <Shield className="w-3 h-3" />;
      case 'support': return <Heart className="w-3 h-3" />;
      default: return <Lightbulb className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="p-4 bg-card border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-primary">Ava - AI Safety Assistant</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-muted-foreground">Online • Always here for you</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
              {message.type === 'bot' && (
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">Ava</span>
                  {message.category && (
                    <Badge className={`text-xs ${getCategoryColor(message.category)}`}>
                      {getCategoryIcon(message.category)}
                      {message.category}
                    </Badge>
                  )}
                </div>
              )}
              
              <div
                className={`rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                  <Clock className="w-3 h-3" />
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">Ava is typing...</span>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Responses */}
      <div className="p-3 bg-card border-t">
        <div className="grid grid-cols-2 gap-2 mb-3">
          {quickResponses.map((response, index) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              onClick={() => sendMessage(response.text)}
              className="text-xs"
            >
              <response.icon className="w-3 h-3 mr-1" />
              {response.text}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-card border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Ask Ava anything about safety..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
            className="flex-1"
          />
          <Button onClick={() => sendMessage(inputMessage)} variant="hero">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;