import mongoose from 'mongoose';
import { CRAFT_SLUGS, DEMAND_LEVELS, TREND_SOURCES } from '../config/constants.js';

const priceRangeSchema = new mongoose.Schema(
  {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    emoji: { type: String, default: '🛍️' },
    priceRange: { type: priceRangeSchema, required: true },
    demandScore: { type: Number, min: 0, max: 100, required: true }, // used for the bar chart
  },
  { _id: false }
);

const marketTrendsSchema = new mongoose.Schema(
  {
    craft: { type: String, enum: CRAFT_SLUGS, required: true },
    trendingSkills: { type: [String], default: [] },
    trendingProducts: { type: [productSchema], default: [] },
    demandLevel: { type: String, enum: DEMAND_LEVELS, required: true },
    priceRange: { type: priceRangeSchema, required: true },
    insights: { type: [String], default: [] },
    source: { type: String, enum: TREND_SOURCES, default: 'seed' },
    model: { type: String, default: '' }, // which LLM produced it (empty for seed)
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    collection: 'markettrends',
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// One seeded document per craft (fallback) + one per AI provider (latest result from that provider)
marketTrendsSchema.index({ craft: 1, source: 1 }, { unique: true });

export default mongoose.model('MarketTrends', marketTrendsSchema);
