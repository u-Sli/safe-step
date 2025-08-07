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

class GeminiChatAPI {
  private apiUrl = 'http://localhost:3001/api';

  async sendMessage(message: string): Promise<APIResponse> {
    try {
      console.log('Sending to backend:', message);
      
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);
      
      return data;
      
    } catch (error) {
      console.error('Backend API failed:', error);
      return {
        message: "I'm here to help with safety advice. How can I assist you today?",
        confidence: 0.6,
        suggestions: ["Safety tips", "Emergency help", "Plan route"]
      };
    }
  }

  updateUserContext() {}
  resetEmergencyMode() {}
}

export const geminiChatAPI = new GeminiChatAPI();
export type { APIResponse };