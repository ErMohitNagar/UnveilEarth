import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ApiResponse } from '../utils/apiResponse.js';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Centralized error-handling middleware.
 *
 * Must be registered **after** all routes so Express forwards
 * unhandled errors here via the 4-argument signature.
 *
 * Handles:
 * - `AppError` — operational errors thrown intentionally
 * - `ZodError` — schema validation failures
 * - Unknown errors — treated as 500 Internal Server Error
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // ── Operational AppError ──────────────────────────────────────
  if (err instanceof AppError) {
    logger.error(
      { err, statusCode: err.statusCode, code: err.code },
      err.message,
    );

    ApiResponse.error(res, err.message, err.statusCode, err.code);
    return;
  }

  // ── Zod validation error ──────────────────────────────────────
  if (err instanceof ZodError) {
    const fieldErrors = err.flatten().fieldErrors;

    logger.warn({ err, fieldErrors }, 'Unhandled ZodError reached error handler');

    ApiResponse.error(
      res,
      'Validation error',
      400,
      'VALIDATION_ERROR',
      fieldErrors,
    );
    return;
  }

  // ── Unexpected / programmer error ─────────────────────────────
  logger.error(
    { err, stack: err.stack },
    'Unhandled error',
  );

  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message || 'An unexpected error occurred';

  ApiResponse.error(res, message, 500, 'INTERNAL_ERROR');
};
