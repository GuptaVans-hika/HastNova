import { Router } from 'express';
import mongoose from 'mongoose';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import roadmapRoutes from './roadmapRoutes.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { aiLimiter } from '../middleware/rateLimit.js';
import { craftParamSchema, opportunityQuerySchema } from '../middleware/schemas.js';
import { listCrafts, getCraft, enrollCraft } from '../controllers/craftController.js';
import { myLearning } from '../controllers/learningController.js';
import { listOpportunities } from '../controllers/opportunityController.js';
import { getTrends } from '../controllers/trendsController.js';
import { isAIConfigured } from '../services/llm/index.js';

const router = Router();

// ---------- Public ----------
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    ai: isAIConfigured() ? 'configured' : 'not configured',
    time: new Date().toISOString(),
  });
});
router.use('/auth', authRoutes);
// Craft catalogue is public so visitors can browse before signing up
router.get('/crafts', optionalAuth, listCrafts);
router.get('/crafts/:craft', optionalAuth, validate(craftParamSchema, 'params'), getCraft);

// ---------- Logged in (JWT) ----------
router.post('/crafts/:craft/enroll', protect, validate(craftParamSchema, 'params'), enrollCraft);
router.use('/profile', protect, profileRoutes);
router.use('/roadmap', protect, roadmapRoutes);
router.get('/my-learning', protect, myLearning);
router.get('/opportunities', protect, validate(opportunityQuerySchema, 'query'), listOpportunities);
router.get('/trends/:craft', protect, aiLimiter, validate(craftParamSchema, 'params'), getTrends);

export default router;
