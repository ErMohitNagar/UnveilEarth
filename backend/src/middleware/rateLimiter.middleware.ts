import { rateLimit } from 'express-rate-limit';
import { Request, Response } from 'express';
import { CONSTANTS } from '../config/constants.js';

/**
 * Shared handler that returns a consistent JSON error when the
 * client exceeds the rate limit.
 */
const limitReachedHandler = (
  _req: Request,
  res: Response,
) => {
  res.status(429).json({
    success: false,
    error: {
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  });
};

/**
 * Global rate limiter applied to all routes.
 * Default: 100 requests per 15-minute window.
 */
export const globalLimiter = rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT.GLOBAL.windowMs,
  limit: CONSTANTS.RATE_LIMIT.GLOBAL.max,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: limitReachedHandler,
});

/**
 * Stricter limiter for AI/LLM endpoints (/discover/*, /chat).
 * Default: 20 requests per 15-minute window.
 */
export const aiLimiter = rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT.AI.windowMs,
  limit: CONSTANTS.RATE_LIMIT.AI.max,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: limitReachedHandler,
});

/**
 * Limiter for authentication endpoints (login, signup, password reset).
 * Default: 10 requests per 15-minute window.
 */
export const authLimiter = rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT.AUTH.windowMs,
  limit: CONSTANTS.RATE_LIMIT.AUTH.max,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: limitReachedHandler,
});
