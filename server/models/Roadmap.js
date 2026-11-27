import mongoose from 'mongoose';
import { CRAFT_SLUGS, LEVELS } from '../config/constants.js';

const stepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    duration: { type: String, required: true },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    craft: { type: String, enum: CRAFT_SLUGS, required: true },
    level: { type: String, enum: LEVELS, required: true },
    steps: {
      type: [stepSchema],
      validate: [(v) => v.length > 0, 'A roadmap needs at least one step'],
    },
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

roadmapSchema.index({ craft: 1, level: 1 }, { unique: true });

export default mongoose.model('Roadmap', roadmapSchema);
