import mongoose from 'mongoose';
import { CRAFT_SLUGS } from '../config/constants.js';

const craftSchema = new mongoose.Schema(
  {
    slug: { type: String, enum: CRAFT_SLUGS, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    hindiName: { type: String, trim: true, default: '' },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // emoji
    image: { type: String, default: '' }, // optional image URL
    accent: { type: String, enum: ['terracotta', 'brown', 'mustard', 'indigo', 'leaf'], default: 'terracotta' },
    tagline: { type: String, default: '' },
    overview: { type: String, default: '' },
    whatYouLearn: { type: [String], default: [] },
    famousStyles: { type: [String], default: [] },
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

export default mongoose.model('Craft', craftSchema);
