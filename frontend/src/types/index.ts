export interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  membership: 'Free' | 'Pro';
  profileImage?: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string; // ISO string
  durationMinutes: number;
  exercise: string;
  sets: number;
  reps: number;
  averageFormScore: number;
}

export interface ProgressDataPoint {
  date: string;
  duration: number; // minutes
  score: number;    // average form score
  volume: number;   // sets * reps * estimated weight (or just reps)
}
