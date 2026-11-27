import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { completedKeySet, stepKey, progressForCraft, stepExists } from '../services/progressService.js';
import { getUserRoadmap, regenerateUserRoadmap, getStepDetails } from '../services/roadmapService.js';

function present(doc, user) {
  const { craft, level } = doc;
  const done = completedKeySet(user, craft);
  const steps = [...doc.steps]
    .sort((a, b) => a.order - b.order)
    // lessons are fetched separately (they're long); just say whether one is ready
    .map(({ details, detailsSource, ...s }) => {
      const key = stepKey(craft, level, s.order);
      return { ...s, key, completed: done.has(key), hasDetails: Boolean(details) };
    });
  return {
    craft,
    level,
    source: doc.source, // groq | gemini | seed
    model: doc.model || '',
    personalised: doc.source !== 'seed',
    generatedAt: doc.generatedAt,
    isUserLevel: user.level === level,
    userLevel: user.level,
    completedCount: steps.filter((s) => s.completed).length,
    steps,
  };
}

// GET /api/roadmap/:craft/:level
// First visit: the AI writes a personal roadmap (or the standard one is used if AI is unavailable).
export const getRoadmap = asyncHandler(async (req, res) => {
  const { craft, level } = req.params;
  const doc = await getUserRoadmap(req.user, craft, level);
  if (!doc) throw new AppError(`No ${level} roadmap is available for this craft yet.`, 404);

  res.json({ success: true, roadmap: present(doc, req.user), progress: await progressForCraft(req.user, craft) });
});

// GET /api/roadmap/:craft/:level/steps/:order - detailed AI lesson for one step (generated once, then saved)
export const getStepLesson = asyncHandler(async (req, res) => {
  const { craft, level, order } = req.params;
  const { details, source, cached } = await getStepDetails(req.user, craft, level, order);
  res.json({ success: true, lesson: { craft, level, order, source, cached, ...details } });
});

// POST /api/roadmap/:craft/:level/regenerate - new AI roadmap, resets that level's progress
export const regenerateRoadmap = asyncHandler(async (req, res) => {
  const { craft, level } = req.params;
  const doc = await regenerateUserRoadmap(req.user, craft, level);
  res.json({
    success: true,
    message: 'Your new roadmap is ready.',
    roadmap: present(doc, req.user),
    progress: await progressForCraft(req.user, craft),
  });
});

// POST /api/roadmap/progress  { craft, level, order, completed? }
// completed: true = mark, false = unmark, omitted = toggle
export const updateProgress = asyncHandler(async (req, res) => {
  const { craft, level, order } = req.body;
  const user = req.user;

  if (!(await stepExists(user, craft, level, order))) {
    throw new AppError(`Step ${order} does not exist in your ${level} roadmap.`, 404);
  }

  const idx = user.completedSteps.findIndex((s) => s.craft === craft && s.level === level && s.order === order);
  const isDone = idx !== -1;
  const completed = req.body.completed ?? !isDone;

  if (completed && !isDone) user.completedSteps.push({ craft, level, order });
  if (!completed && isDone) user.completedSteps.splice(idx, 1);
  user.enroll(craft); // auto-enroll + update last activity

  await user.save();

  res.json({
    success: true,
    step: { key: stepKey(craft, level, order), craft, level, order, completed },
    progress: await progressForCraft(user, craft),
  });
});
