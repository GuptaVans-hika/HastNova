import mongoose from 'mongoose';
import { CRAFT_SLUGS, LEVELS } from '../config/constants.js';

// A user's own roadmap for one craft + level, written by the AI for them
// (or a copy of the standard seeded roadmap if the AI was unavailable).
// It never changes by itself, so "craft + level + step number" progress stays correct.
// Only an explicit "regenerate" replaces it (and resets that level's progress).

const stepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    duration: { type: String, required: true },
    safetyTip: { type: String, default: '' },
    // Detailed AI lesson, written the first time the user opens this step (validated with zod first)
    details: { type: mongoose.Schema.Types.Mixed, default: undefined },
    detailsSource: { type: String, enum: ['groq', 'gemini'], default: undefined },
  },
  { _id: false }
);

const userRoadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    craft: { type: String, enum: CRAFT_SLUGS, required: true },
    level: { type: String, enum: LEVELS, required: true },
    steps: { type: [stepSchema], validate: [(v) => v.length > 0, 'A roadmap needs at least one step'] },
    source: { type: String, enum: ['groq', 'gemini', 'seed'], required: true },
    model: { type: String, default: '' },
    generatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

userRoadmapSchema.index({ user: 1, craft: 1, level: 1 }, { unique: true });

export default mongoose.model('UserRoadmap', userRoadmapSchema);
