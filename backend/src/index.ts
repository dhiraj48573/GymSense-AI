import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import coachingRouter from './routes/coaching';
import authRouter from './routes/auth';
import workoutsRouter from './routes/workouts';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/coaching', coachingRouter);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'GymSense API is running' });
});

// Centralized error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gymsense';

async function startServer() {
  try {
    console.log(`Attempting to connect to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');
  } catch (error) {
    console.warn('Failed to connect to primary MongoDB instance. Falling back to in-memory database for local development...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log('Connected to in-memory MongoDB fallback at', memoryUri);
    } catch (memError) {
      console.error('Critical Error: Failed to connect to any database.', memError);
      process.exit(1);
    }
  }

  app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
  });
}

startServer();
