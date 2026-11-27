import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../middleware/schemas.js';
import { loginLimiter, loginPhoneLimiter, registerLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/register', registerLimiter, validate(registerSchema), register);
router.post('/login', loginLimiter, loginPhoneLimiter, validate(loginSchema), login);

export default router;
