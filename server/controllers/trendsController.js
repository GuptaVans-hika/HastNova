import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { getTrendsForCraft } from '../services/trendsService.js';

// GET /api/trends/:craft
// Cached AI result (< TRENDS_TTL_DAYS old) -> fresh AI (Groq -> Gemini) -> seeded data
export const getTrends = asyncHandler(async (req, res) => {
  const result = await getTrendsForCraft(req.params.craft);
  if (!result) throw new AppError('No market trends available for this craft yet.', 404);

  const { __v, _id, ...data } = result.doc;
  res.json({
    success: true,
    trends: {
      ...data,
      aiGenerated: data.source !== 'seed',
      stale: result.stale,
      // ready-made series for the client's Recharts bar chart
      chart: data.trendingProducts.map((p) => ({ label: p.name, demand: p.demandScore })),
    },
  });
});
