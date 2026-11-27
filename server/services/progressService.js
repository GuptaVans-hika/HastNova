import Roadmap from '../models/Roadmap.js';
import UserRoadmap from '../models/UserRoadmap.js';
import { LEVELS } from '../config/constants.js';

export const stepKey = (craft, level, order) => `${craft}:${level}:${order}`;

export function completedKeySet(user, craft) {
  return new Set(
    user.completedSteps.filter((s) => !craft || s.craft === craft).map((s) => stepKey(s.craft, s.level, s.order))
  );
}

// The steps a user actually follows: their own (AI) roadmap where it exists, otherwise the standard one.
// Returns { [craft]: { total, roadmaps: { Beginner: steps[], ... } } }
async function loadRoadmaps(user, crafts) {
  const [standard, personal] = await Promise.all([
    Roadmap.find({ craft: { $in: crafts } }, { craft: 1, level: 1, 'steps.order': 1, 'steps.title': 1 }).lean(),
    UserRoadmap.find(
      { user: user._id, craft: { $in: crafts } },
      { craft: 1, level: 1, 'steps.order': 1, 'steps.title': 1 }
    ).lean(),
  ]);

  const byCraft = {};
  for (const doc of [...standard, ...personal]) {
    // personal docs come second, so they replace the standard ones
    (byCraft[doc.craft] ??= { roadmaps: {} }).roadmaps[doc.level] = [...doc.steps].sort((a, b) => a.order - b.order);
  }
  for (const info of Object.values(byCraft)) {
    info.total = LEVELS.reduce((n, l) => n + (info.roadmaps[l]?.length || 0), 0);
  }
  return byCraft;
}

// Progress for one craft: counts only steps that actually exist in the roadmaps being followed
export function summarise(user, craft, info) {
  const done = completedKeySet(user, craft);
  let completed = 0;
  let nextStep = null;
  for (const level of LEVELS) {
    for (const step of info?.roadmaps[level] || []) {
      if (done.has(stepKey(craft, level, step.order))) completed += 1;
      else if (!nextStep) nextStep = { level, order: step.order, title: step.title };
    }
  }
  const total = info?.total || 0;
  return {
    totalSteps: total,
    completedSteps: completed,
    percent: total ? Math.round((completed / total) * 100) : 0,
    nextStep,
  };
}

export async function progressForCraft(user, craft) {
  const all = await loadRoadmaps(user, [craft]);
  return summarise(user, craft, all[craft]);
}

export async function progressForEnrolled(user) {
  const crafts = user.enrolledCrafts.map((e) => e.craft);
  const all = await loadRoadmaps(user, crafts);
  return { all, summarise: (craft) => summarise(user, craft, all[craft]) };
}

// Does this step exist in the roadmap the user follows for craft + level?
export async function stepExists(user, craft, level, order) {
  const personal = await UserRoadmap.exists({ user: user._id, craft, level });
  if (personal) return Boolean(await UserRoadmap.exists({ user: user._id, craft, level, 'steps.order': order }));
  return Boolean(await Roadmap.exists({ craft, level, 'steps.order': order }));
}
