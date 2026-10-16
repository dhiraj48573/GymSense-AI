import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkoutSession extends Document {
  userId: mongoose.Types.ObjectId;
  exercise: string;
  reps: number;
  sets: number;
  durationSec: number;
  formScore: number;
  cues: string[];
  createdAt: Date;
}

const WorkoutSessionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  exercise: { type: String, required: true },
  reps: { type: Number, required: true },
  sets: { type: Number, required: true },
  durationSec: { type: Number, required: true },
  formScore: { type: Number, required: true },
  cues: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IWorkoutSession>('WorkoutSession', WorkoutSessionSchema);
