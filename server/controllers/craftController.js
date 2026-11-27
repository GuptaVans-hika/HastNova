import Craft from '../models/Craft.js';
import Roadmap from '../models/Roadmap.js';
import Opportunity from '../models/Opportunity.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { CRAFT_SLUGS, LEVELS } from '../config/constants.js';
import { progressForCraft } from '../services/progressService.js';

async function countsByCraft(match = {}) {
  const [steps, opps] = await Promise.all([
    Roadmap.aggregate([{ $match: match }, { $group: { _id: '$craft', stepCount: { $sum: { $size: '$steps' } } } }]),
    Opportunity.aggregate([{ $match: match }, { $group: { _id: '$craft', opportunityCount: { $sum: 1 } } }]),
  ]);
  const map = {};
  steps.forEach((s) => ((map[s._id] ??= {}).stepCount = s.stepCount));
  opps.forEach((o) => ((map[o._id] ??= {}).opportunityCount = o.opportunityCount));
  return map;
}

// GET /api/crafts  (public; `enrolled` is filled in when logged in)
export const listCrafts = asyncHandler(async (req, res) => {
  const [crafts, counts] = await Promise.all([Craft.find().lean(), countsByCraft()]);
  crafts.sort((a, b) => CRAFT_SLUGS.indexOf(a.slug) - CRAFT_SLUGS.indexOf(b.slug));

  const data = crafts.map(({ __v, ...c }) => ({
    ...c,
    stepCount: counts[c.slug]?.stepCount || 0,
    opportunityCount: counts[c.slug]?.opportunityCount || 0,
    enrolled: req.user ? req.user.isEnrolled(c.slug) : false,
  }));
  res.json({ success: true, count: data.length, crafts: data });
});

// GET /api/crafts/:craft  (public; `enrolled` and `progress` only when logged in)
// `levels` previews the standard roadmap - logged-in users get their own AI roadmap via /api/roadmap
export const getCraft = asyncHandler(async (req, res) => {
  const { craft: slug } = req.params;
  const craft = await Craft.findOne({ slug }).lean();
  if (!craft) throw new AppError('Craft not found.', 404);

  const [roadmaps, opportunityCount, progress] = await Promise.all([
    Roadmap.find({ craft: slug }, { level: 1, 'steps.order': 1, 'steps.title': 1 }).lean(),
    Opportunity.countDocuments({ craft: slug }),
    req.user ? progressForCraft(req.user, slug) : null,
  ]);

  const levels = LEVELS.map((level) => {
    const r = roadmaps.find((x) => x.level === level);
    return { level, stepCount: r?.steps.length || 0, stepTitles: (r?.steps || []).map((s) => s.title) };
  });

  const { __v, ...rest } = craft;
  res.json({
    success: true,
    craft: {
      ...rest,
      stepCount: levels.reduce((n, l) => n + l.stepCount, 0),
      opportunityCount,
      levels,
      enrolled: req.user ? req.user.isEnrolled(slug) : false,
      progress,
    },
  });
});

// POST /api/crafts/:craft/enroll
export const enrollCraft = asyncHandler(async (req, res) => {
  const { craft: slug } = req.params;
  if (!(await Craft.exists({ slug }))) throw new AppError('Craft not found.', 404);

  const isNew = req.user.enroll(slug);
  await req.user.save();

  res.status(isNew ? 201 : 200).json({
    success: true,
    message: isNew ? 'Enrolled successfully.' : 'You are already enrolled in this craft.',
    enrolledCrafts: req.user.enrolledCrafts,
  });
});
