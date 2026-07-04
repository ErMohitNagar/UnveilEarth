import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/apiResponse.js';

/**
 * Factory that returns middleware enforcing role-based access control.
 *
 * Checks `req.user.app_metadata.role` first (Supabase convention),
 * then falls back to `req.user.role`.
 *
 * Must be placed **after** `verifyJwt` in the middleware chain so
 * that `req.user` is guaranteed to exist.
 *
 * @param roles - One or more allowed role strings
 *
 * @example
 *   router.delete('/admin/resource', verifyJwt, requireRole('admin'), handler);
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        new AppError('Authentication required', 401, 'AUTH_REQUIRED'),
      );
    }

    const userRole =
      req.user.app_metadata?.role ?? req.user.role;

    if (!userRole || !roles.includes(userRole)) {
      return next(
        new AppError(
          `Forbidden: requires one of [${roles.join(', ')}]`,
          403,
          'FORBIDDEN_ROLE',
        ),
      );
    }

    next();
  };
};
