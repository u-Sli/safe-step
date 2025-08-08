interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface APIResponse {
  message: string;
  confidence: number;
  suggestions?: string[];
  actions?: Array<{
    type: 'emergency' | 'location' | 'report' | 'tips';
    label: string;
    data?: any;
  }>;
}

class ChatAPI {
  private conversationHistory: ChatMessage[] = [];
  private userContext = {
    location: null as string | null,
    riskLevel: 'medium' as 'low' | 'medium' | 'high',
    previousTopics: [] as string[],
    emergencyMode: false
  };

  private responses = {
    emergency: {
      immediate: [
        "🚨 I understand this is urgent. If you're in immediate danger, call 10111 (SAPS) or use the SOS button. I'm here to help guide you to safety.",
        "Your safety is my priority. Are you in a safe location right now? If not, try to get to a public, well-lit area while we talk.",
        "I'm activating emergency protocols. Please stay calm and follow my guidance. Can you tell me your current location?"
      ],
      followUp: [
        "Have you been able to contact emergency services? I can help you prepare information they might need.",
        "Focus on getting to safety first. I'll stay with you through this. What's your immediate surroundings like?",
        "Remember: trust your instincts, stay in public areas, and keep your phone charged. How can I help you right now?"
      ]
    },
    safety: {
      general: [
        "Here are key safety practices: Share your location with trusted contacts, stay in well-lit areas, trust your instincts, and always have an exit plan.",
        "Personal safety starts with awareness. Keep your head up, avoid distractions like headphones in risky areas, and let someone know your plans.",
        "Your intuition is your best defense. If something feels wrong, it probably is. Don't worry about being rude - prioritize your safety."
      ],
      specific: [
        "For walking alone: Stick to main roads, avoid shortcuts through isolated areas, carry a charged phone, and consider using Guardian Mode to share your location.",
        "When using public transport: Sit near the driver/conductor, stay alert, have your route planned, and keep emergency contacts easily accessible.",
        "At night: Travel in groups when possible, use well-lit paths, avoid wearing headphones, and consider carrying a personal alarm."
      ]
    },
    routes: [
      "I can help you plan safer routes! Consider factors like lighting, foot traffic, proximity to help, and community safety reports. Where are you heading?",
      "Route safety depends on time of day, lighting, and community activity. I recommend main roads over shortcuts. What's your destination?",
      "Let me suggest the safest path. I'll consider current safety reports, lighting conditions, and populated areas. Share your start and end points."
    ],
    support: [
      "You're taking the right steps by prioritizing your safety. The SafeStep community is here to support you - you're not alone in this.",
      "Your safety matters, and seeking help shows strength, not weakness. Trust yourself and don't hesitate to reach out when you need support.",
      "Remember: you have the right to feel safe. Every precaution you take is valid, and your concerns are important."
    ],
    harassment: [
      "I'm sorry you're experiencing this. Document everything safely, trust your instincts, and prioritize getting to a safe space. Consider using the fake call feature.",
      "Harassment is never acceptable. Your safety comes first - don't engage, get to a public area, and consider reporting the incident when you're safe.",
      "You don't owe anyone politeness when you feel unsafe. Use whatever tools you need - fake calls, changing routes, or asking for help."
    ]
  };

  private getContextualResponse(userMessage: string): APIResponse {
    const message = userMessage.toLowerCase();
    const isEmergency = this.detectEmergency(message);
    
    if (isEmergency) {
      this.userContext.emergencyMode = true;
      return this.getEmergencyResponse(message);
    }

    if (this.userContext.emergencyMode && !message.includes('cancel') && !message.includes('safe')) {
      return this.getEmergencyFollowUp(message);
    }

    if (message.includes('safe') && this.userContext.emergencyMode) {
      this.userContext.emergencyMode = false;
      return {
        message: "I'm glad you're safe now. Take a moment to breathe. Would you like to talk about what happened or get some support resources?",
        confidence: 0.9,
        suggestions: ["Report the incident", "Get support resources", "Safety tips for the future"]
      };
    }

    return this.getRegularResponse(message);
  }

  private detectEmergency(message: string): boolean {
    const emergencyKeywords = [
      'emergency', 'danger', 'help me', 'scared', 'following me', 
      'threatened', 'unsafe', 'trapped', 'attacked', 'stalking'
    ];
    return emergencyKeywords.some(keyword => message.includes(keyword));
  }

  private getEmergencyResponse(message: string): APIResponse {
    const responses = this.userContext.previousTopics.includes('emergency') 
      ? this.responses.emergency.followUp 
      : this.responses.emergency.immediate;
    
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      confidence: 0.95,
      actions: [
        { type: 'emergency', label: 'Call Emergency Services', data: { number: '10111' } },
        { type: 'location', label: 'Share Location', data: { action: 'share_location' } },
        { type: 'emergency', label: 'Activate SOS', data: { action: 'sos' } }
      ]
    };
  }

  private getEmergencyFollowUp(message: string): APIResponse {
    return {
      message: "I'm still here with you. Focus on staying safe. Are you able to get to a public area or contact someone you trust?",
      confidence: 0.9,
      actions: [
        { type: 'emergency', label: 'I\'m Safe Now', data: { action: 'mark_safe' } },
        { type: 'location', label: 'Find Safe Places', data: { action: 'find_safe_places' } }
      ]
    };
  }

  private getRegularResponse(message: string): APIResponse {
    // Greetings
    if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
      const greetings = [
        "Hi there! 👋 I'm your SafeStep AI assistant, here to help keep you safe.",
        "Hello! Great to see you. I'm here to help with any safety concerns you might have.",
        "Hey! I'm your personal safety assistant. How can I help you stay safe today?"
      ];
      return {
        message: greetings[Math.floor(Math.random() * greetings.length)],
        confidence: 0.9,
        suggestions: ["Safety tips", "Plan a route", "Emergency help", "Check area safety"]
      };
    }

    // Thank you responses
    if (message.includes('thank') || message.includes('thanks')) {
      return {
        message: "You're welcome! I'm always here to help keep you safe. Is there anything else you need assistance with?",
        confidence: 0.9,
        suggestions: ["More safety tips", "Plan another route", "Emergency contacts"]
      };
    }

    // How are you responses
    if (message.includes('how are you') || message.includes('how do you do')) {
      return {
        message: "I'm doing well, thank you for asking! More importantly, how are you feeling about your safety today? I'm here to help with any concerns.",
        confidence: 0.8,
        suggestions: ["I feel safe", "I have concerns", "Safety tips please"]
      };
    }

    if (message.includes('route') || message.includes('direction') || message.includes('path')) {
      this.userContext.previousTopics.push('routes');
      return {
        message: this.responses.routes[Math.floor(Math.random() * this.responses.routes.length)],
        confidence: 0.8,
        suggestions: ["Plan safe route", "Check area safety", "Get real-time updates"]
      };
    }

    if (message.includes('harassment') || message.includes('catcall') || message.includes('uncomfortable')) {
      this.userContext.previousTopics.push('harassment');
      return {
        message: this.responses.harassment[Math.floor(Math.random() * this.responses.harassment.length)],
        confidence: 0.85,
        actions: [
          { type: 'report', label: 'Report Incident', data: { type: 'harassment' } },
          { type: 'tips', label: 'Get Safety Tips', data: { category: 'harassment' } }
        ]
      };
    }

    if (message.includes('tip') || message.includes('advice') || message.includes('safe')) {
      const safetyType = message.includes('walk') || message.includes('alone') ? 'specific' : 'general';
      return {
        message: this.responses.safety[safetyType][Math.floor(Math.random() * this.responses.safety[safetyType].length)],
        confidence: 0.75,
        suggestions: ["More safety tips", "Emergency contacts", "Guardian Mode setup"]
      };
    }

    if (message.includes('location') || message.includes('area') || message.includes('where')) {
      const riskLevel = this.userContext.riskLevel;
      const riskMessages = {
        low: "Your current area appears relatively safe based on community reports. Stay alert and trust your instincts.",
        medium: "This area has moderate risk levels. Consider staying in well-lit, populated areas and letting someone know your location.",
        high: "Community reports indicate higher risk in this area. Please consider finding a safer location or activating Guardian Mode."
      };
      
      return {
        message: riskMessages[riskLevel],
        confidence: 0.7,
        actions: [
          { type: 'location', label: 'Check Area Safety', data: { action: 'area_check' } },
          { type: 'location', label: 'Find Safe Places', data: { action: 'safe_places' } }
        ]
      };
    }

    // Default supportive response
    return {
      message: this.responses.support[Math.floor(Math.random() * this.responses.support.length)],
      confidence: 0.6,
      suggestions: ["Safety tips", "Plan a route", "Emergency help", "Community support"]
    };
  }

  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<APIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
    
    this.conversationHistory = conversationHistory;
    const response = this.getContextualResponse(message);
    
    // Add some personality and context awareness
    if (conversationHistory.length > 5) {
      response.message = "I notice we've been chatting for a while. " + response.message;
    }
    
    return response;
  }

  updateUserContext(context: Partial<typeof this.userContext>) {
    this.userContext = { ...this.userContext, ...context };
  }

  resetEmergencyMode() {
    this.userContext.emergencyMode = false;
  }
}

export const chatAPI = new ChatAPI();
export type { APIResponse, ChatMessage };