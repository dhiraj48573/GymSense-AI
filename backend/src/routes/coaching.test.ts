import request from 'supertest';
import express from 'express';
import coachingRouter from './coaching';

const app = express();
app.use(express.json());
app.use('/api/coaching', coachingRouter);

describe('Coaching API', () => {
  it('should return 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/coaching/generate')
      .send({
        // missing exercise, reps, sets
        form_score: 90
      });
      
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid request payload');
  });

  it('should return fallback message if API key is missing (or in testing environment)', async () => {
    const res = await request(app)
      .post('/api/coaching/generate')
      .send({
        exercise: 'Squat',
        reps: 10,
        sets: 1,
        form_score: 95
      });
      
    expect(res.status).toBe(200);
    expect(res.body.coach_message).toContain('Fallback mode: Missing API Key');
    expect(res.body.coach_message).toContain('Great job on those 10 reps of Squat');
  });
  
  it('should enforce rate limiting', async () => {
    // Send 11 requests, the 11th should fail
    const payload = {
      exercise: 'Push-up',
      reps: 5,
      sets: 1,
      form_score: 80
    };
    
    for (let i = 0; i < 10; i++) {
      const res = await request(app).post('/api/coaching/generate').send(payload);
      expect([200, 429]).toContain(res.status);
    }
    
    const rateLimitedRes = await request(app).post('/api/coaching/generate').send(payload);
    expect(rateLimitedRes.status).toBe(429); // Too many requests
  });
});
