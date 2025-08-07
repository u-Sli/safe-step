import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyBUNV4tSLU8ZA6lo4saSeoD2qJz4Ln8dvM');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('User message:', message);

    // Create conversational Gemini prompt
    const prompt = `You are SafeStep AI, a friendly and helpful personal safety assistant for South Africa. You have a warm, conversational personality and genuinely care about keeping people safe.

User says: "${message}"

Respond naturally like you're having a real conversation. Be helpful, engaging, and informative. Give detailed advice when appropriate. For emergencies, mention calling 10111 (SAPS). Show empathy and understanding.`;

    // Call Gemini API with retry logic
    let result;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        result = await model.generateContent(prompt);
        break; // Success, exit retry loop
      } catch (error) {
        attempts++;
        if (error.status === 503 && attempts < maxAttempts) {
          console.log(`Attempt ${attempts} failed, retrying in ${attempts * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, attempts * 1000));
        } else {
          throw error; // Re-throw if not 503 or max attempts reached
        }
      }
    }
    
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response:', text);

    // Send response back to frontend
    res.json({
      message: text.trim(),
      confidence: 0.9,
      suggestions: ["Tell me more", "Safety tips", "Emergency help", "Plan route"]
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback response
    res.json({
      message: "I'm here to help keep you safe. How can I assist you today?",
      confidence: 0.6,
      suggestions: ["Safety tips", "Emergency help", "Plan route"]
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', gemini: 'connected' });
});

app.listen(PORT, () => {
  console.log(`🚀 SafeStep API server running on http://localhost:${PORT}`);
  console.log(`🤖 Gemini AI integration active`);
});