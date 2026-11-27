import mongoose from 'mongoose';
import { CRAFT_SLUGS, OPPORTUNITY_TYPES } from '../config/constants.js';

const opportunitySchema = new mongoose.Schema(
  {
    craft: { type: String, enum: CRAFT_SLUGS, required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: OPPORTUNITY_TYPES, required: true },
    location: { type: String, required: true, trim: true }, // e.g. "Bhuj, Gujarat"
    description: { type: String, required: true },
    contact: { type: String, default: '' },
    link: { type: String, default: '' },
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

opportunitySchema.index({ craft: 1, type: 1 });

export default mongoose.model('Opportunity', opportunitySchema);
