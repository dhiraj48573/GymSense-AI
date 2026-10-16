import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import Groq from 'groq-sdk';

const router = Router();

// Initialize Groq client only if key is present
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// Rate limiting: max 10 requests per minute per IP for coaching
const coachingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests from this IP, please try again after a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Zod schema for request validation
const coachingRequestSchema = z.object({
  exercise: z.string().min(1),
  reps: z.number().min(0),
  sets: z.number().min(0),
  form_score: z.number().min(0).max(100),
  recent_cues: z.array(z.string()).optional(),
  elapsed_time_sec: z.number().optional(),
});

router.post('/generate', coachingLimiter, async (req, res) => {
  try {
    // 1. Validate payload
    const parsed = coachingRequestSchema.parse(req.body);
    
    // 2. Safe Fallback if Groq is not configured or missing API key
    if (!groq) {
      return res.json({
        coach_message: `Great job on those ${parsed.reps} reps of ${parsed.exercise}! Keep it up! (Fallback mode: Missing API Key)`
      });
    }

    // 3. Construct prompt for Groq
    const systemPrompt = `You are an encouraging, friendly, and concise AI fitness coach for a beginner.
You receive structured workout events. Provide a 1-2 sentence response.
Do NOT give medical advice or diagnose injuries. 
If the form score is low or there are specific cues, gently remind them of good form.
Always keep it positive and motivational.`;

    const userPrompt = `I just completed a set.
Exercise: ${parsed.exercise}
Reps: ${parsed.reps}
Total Sets: ${parsed.sets}
Form Score: ${parsed.form_score}/100
Recent System Cues: ${parsed.recent_cues ? parsed.recent_cues.join(', ') : 'None'}`;

    // 4. Call Groq
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: process.env.GROQ_MODEL || 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 100,
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    return res.json({ coach_message: reply || 'Keep going!' });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request payload', details: error.issues });
    }
    
    console.error('Groq API Error:', error);
    // Safe fallback if API call fails
    return res.status(503).json({ 
      coach_message: 'Great effort! (Coaching service temporarily unavailable)',
      error: 'Service unavailable'
    });
  }
});

export default router;
