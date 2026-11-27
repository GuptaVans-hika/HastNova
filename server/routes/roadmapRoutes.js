import { Router } from 'express';
import { getRoadmap, getStepLesson, regenerateRoadmap, updateProgress } from '../controllers/roadmapController.js';
import { validate } from '../middleware/validate.js';
import { roadmapParamSchema, stepParamSchema, progressSchema } from '../middleware/schemas.js';
import { aiLimiter, regenerateLimiter } from '../middleware/rateLimit.js';

const router = Router();

// "/progress" is registered first so it is never treated as a :craft.
// Ticking steps never calls the AI, so it is not AI-rate-limited.
router.post('/progress', validate(progressSchema), updateProgress);
router.get('/:craft/:level', aiLimiter, validate(roadmapParamSchema, 'params'), getRoadmap);
router.get('/:craft/:level/steps/:order', aiLimiter, validate(stepParamSchema, 'params'), getStepLesson);
router.post(
  '/:craft/:level/regenerate',
  aiLimiter,
  regenerateLimiter,
  validate(roadmapParamSchema, 'params'),
  regenerateRoadmap
);

export default router;
