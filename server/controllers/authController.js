import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../services/tokenService.js';
import { AppError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const SALT_ROUNDS = 12;
// Used when the phone is unknown so the response time is similar either way
const DUMMY_HASH = bcrypt.hashSync('karigarskill-dummy-password', SALT_ROUNDS);

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { password, ...profile } = req.body;

  if (await User.exists({ phone: profile.phone })) {
    throw new AppError('This phone number is already registered. Please log in.', 409, [
      { field: 'phone', message: 'Already registered' },
    ]);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ ...profile, passwordHash });
  user.enroll(profile.primaryCraft); // start the primary craft automatically
  await user.save();

  res.status(201).json({ success: true, token: signToken(user), user });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone }).select('+passwordHash');

  const ok = await bcrypt.compare(password, user?.passwordHash || DUMMY_HASH);
  if (!user || !ok) {
    throw new AppError('Wrong phone number or password.', 401);
  }

  res.json({ success: true, token: signToken(user), user });
});
