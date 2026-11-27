import Craft from '../models/Craft.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { progressForEnrolled } from '../services/progressService.js';

// GET /api/my-learning - enrolled crafts with progress %, most recent activity first
export const myLearning = asyncHandler(async (req, res) => {
  const user = req.user;
  const slugs = user.enrolledCrafts.map((e) => e.craft);

  const [crafts, { summarise }] = await Promise.all([
    Craft.find({ slug: { $in: slugs } }, { slug: 1, name: 1, icon: 1, hindiName: 1 }).lean(),
    progressForEnrolled(user),
  ]);
  const craftBySlug = Object.fromEntries(crafts.map((c) => [c.slug, c]));

  const items = [...user.enrolledCrafts]
    .sort((a, b) => b.lastActivityAt - a.lastActivityAt)
    .filter((e) => craftBySlug[e.craft])
    .map((e) => {
      const c = craftBySlug[e.craft];
      return {
        craft: e.craft,
        name: c.name,
        hindiName: c.hindiName,
        icon: c.icon,
        isPrimary: e.craft === user.primaryCraft,
        enrolledAt: e.enrolledAt,
        lastActivityAt: e.lastActivityAt,
        ...summarise(e.craft),
      };
    });

  res.json({ success: true, count: items.length, learning: items });
});
