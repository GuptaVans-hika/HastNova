import User from '../models/User.js';
import { verifyToken } from '../services/tokenService.js';
import { AppError } from './errorHandler.js';
import { asyncHandler } from './asyncHandler.js';

function bearerToken(req) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  return scheme === 'Bearer' && token ? token : null;
}

// Requires "Authorization: Bearer <token>"; attaches the user document to req.user
export const protect = asyncHandler(async (req, _res, next) => {
  const token = bearerToken(req);
  if (!token) throw new AppError('Please log in to continue.', 401);

  const payload = verifyToken(token); // throws JsonWebTokenError / TokenExpiredError
  const user = await User.findById(payload.sub);
  if (!user) throw new AppError('Account not found. Please log in again.', 401);

  req.user = user;
  next();
});

// For public pages: attaches req.user when a valid token is sent, otherwise continues as a guest
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = bearerToken(req);
  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = (await User.findById(payload.sub)) || undefined;
    } catch {
      req.user = undefined;
    }
  }
  next();
});
