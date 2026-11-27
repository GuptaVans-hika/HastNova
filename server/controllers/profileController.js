import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';

// GET /api/profile
export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// Runs before validation so users get a clear message instead of "unrecognised key"
export function blockLockedFields(req, _res, next) {
  if (req.body && 'phone' in req.body) {
    return next(new AppError('Phone number cannot be changed.', 400, [{ field: 'phone', message: 'Not editable' }]));
  }
  if (req.body && ('password' in req.body || 'passwordHash' in req.body)) {
    return next(new AppError('Password cannot be changed from the profile.', 400, [{ field: 'password', message: 'Not editable' }]));
  }
  next();
}

// PUT /api/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const { location, ...rest } = req.body;

  // experience vs age check against the merged result
  const age = rest.age ?? user.age;
  const exp = rest.experienceYears ?? user.experienceYears;
  if (exp > age) {
    throw new AppError('Experience cannot be more than your age.', 400, [
      { field: 'experienceYears', message: 'Experience cannot be more than your age' },
    ]);
  }

  Object.assign(user, rest);
  if (location) {
    if (location.city !== undefined) user.location.city = location.city;
    if (location.state !== undefined) user.location.state = location.state;
  }
  if (rest.primaryCraft) user.enroll(rest.primaryCraft);

  await user.save();
  res.json({ success: true, message: 'Profile updated.', user });
});
