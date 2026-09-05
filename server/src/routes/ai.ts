import express from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { query } from '../db/init.js';

const router = express.Router();

const FALLBACK_RESPONSES: { [key: string]: string } = {
  'help': 'Welcome to CALL ME! You can use this assistant to get help with video calling, face effects, and more.',
  'camera': 'To enable your camera: 1. Click "Enable Camera" in the dashboard 2. Select your preferred camera 3. Grant permission when prompted',
  'effect': 'Face effects let you transform your appearance in real-time. Upload an image to use as your effect source.',
  'call': 'To start a call: 1. Click "Start Call" to create a room 2. Share the call ID with friends 3. They can join using the "Join Call" button',
  'default': 'I\'m here to help! Ask me about cameras, microphones, face effects, or how to make calls.'
};

router.post('/chat', async (req: AuthRequest, res: express.Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // Check if OpenAI is configured
    if (process.env.OPENAI_API_KEY) {
      try {
        // TODO: Implement OpenAI integration when available
        return res.json({ 
          response: 'AI assistant is being initialized. Please try again shortly.',
          source: 'fallback'
        });
      } catch (error) {
        console.error('OpenAI error:', error);
      }
    }

    // Fallback responses
    const lowerMessage = message.toLowerCase();
    let response = FALLBACK_RESPONSES['default'];

    for (const [key, value] of Object.entries(FALLBACK_RESPONSES)) {
      if (key !== 'default' && lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    // Log AI usage
    await query(
      'INSERT INTO ai_usage (user_id, tokens_used, cost) VALUES ($1, $2, $3)',
      [req.user.id, 10, 0]
    );

    res.json({ response, source: 'fallback' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process message' });
  }
});

export default router;
