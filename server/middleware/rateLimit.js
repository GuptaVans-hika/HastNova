import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const json = (message) => ({ success: false, message });

// General limit for the whole API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: json('Too many requests. Please slow down and try again in a few minutes.'),
});

// Strict limit on login: 5 attempts per 15 min per IP + phone.
// Successful logins don't count against the limit.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => `${req.ip}:${String(req.body?.phone || '')}`,
  message: json('Too many login attempts. Please wait 15 minutes and try again.'),
});

// Also limit failed logins per phone number from any IP (stops guessing one account from many IPs)
export const loginPhoneLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => `phone:${String(req.body?.phone || '')}`,
  message: json('Too many failed logins for this number. Please wait an hour or contact support.'),
});

// AI roadmap regenerations: a few per user per day (runs after `protect`, so req.user exists)
export const regenerateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: env.roadmapRegenerationsPerDay,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => `regen:${req.user._id}`,
  message: json(`You can create a new roadmap ${env.roadmapRegenerationsPerDay} times a day. Please try again tomorrow.`),
});

// Pages that may trigger an AI call (trends, first roadmap visit): per user, per minute
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => `ai:${req.user?._id || req.ip}`,
  message: json('You are going a bit fast. Please wait a minute and try again.'),
});

// Limit account creation: 10 per hour per IP
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: json('Too many sign-up attempts from this network. Please try again later.'),
});
