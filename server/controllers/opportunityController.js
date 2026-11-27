import Opportunity from '../models/Opportunity.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/opportunities?craft=&type=&location=
export const listOpportunities = asyncHandler(async (req, res) => {
  const { craft, type, location } = req.query;
  const filter = {};
  if (craft) filter.craft = craft;
  if (type) filter.type = type;
  if (location) filter.location = { $regex: escapeRegex(location), $options: 'i' };

  const [opportunities, allLocations] = await Promise.all([
    Opportunity.find(filter).sort({ type: 1, name: 1 }).lean(),
    Opportunity.distinct('location', craft ? { craft } : {}),
  ]);

  res.json({
    success: true,
    count: opportunities.length,
    filters: { craft: craft || null, type: type || null, location: location || null },
    locations: allLocations.sort(), // for the client's location dropdown
    opportunities: opportunities.map(({ __v, ...o }) => o),
  });
});
