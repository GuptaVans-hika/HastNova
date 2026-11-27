import { Router } from 'express';
import { getProfile, updateProfile, blockLockedFields } from '../controllers/profileController.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../middleware/schemas.js';

const router = Router();

router.get('/', getProfile);
router.put('/', blockLockedFields, validate(updateProfileSchema), updateProfile);

export default router;
