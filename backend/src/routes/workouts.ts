import { Router, Response } from 'express';
import { z } from 'zod';
import WorkoutSession from '../models/WorkoutSession';
import { requireAuth, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

const createWorkoutSchema = z.object({
  exercise: z.string().min(1),
  reps: z.number().min(0),
  sets: z.number().min(0),
  durationSec: z.number().min(0),
  formScore: z.number().min(0).max(100),
  cues: z.array(z.string()).optional(),
});

// Create a new workout session
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createWorkoutSchema.parse(req.body);

    const session = await WorkoutSession.create({
      userId: req.user!.id,
      ...parsed,
    });

    return res.status(201).json({ session });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.issues });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

import mongoose from 'mongoose';

// Get progress summaries (e.g. for charts)
router.get('/progress', async (req: AuthRequest, res: Response) => {
  try {
    const stats = await WorkoutSession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user!.id) } },
      { 
        $group: {
          _id: '$exercise',
          totalSets: { $sum: '$sets' },
          totalReps: { $sum: '$reps' },
          avgFormScore: { $avg: '$formScore' },
          totalDuration: { $sum: '$durationSec' }
        }
      }
    ]);

    // Format for frontend charts
    const progress = stats.map(s => ({
      exercise: s._id,
      totalSets: s.totalSets,
      totalReps: s.totalReps,
      avgFormScore: Math.round(s.avgFormScore),
      totalDuration: s.totalDuration
    }));

    return res.json({ progress });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's workout history
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const sessions = await WorkoutSession.find({ userId: req.user!.id })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.json({ sessions });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific session
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const session = await WorkoutSession.findOne({ 
      _id: req.params.id, 
      userId: req.user!.id 
    });

    if (!session) {
      return res.status(404).json({ error: 'Workout session not found' });
    }

    return res.json({ session });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
