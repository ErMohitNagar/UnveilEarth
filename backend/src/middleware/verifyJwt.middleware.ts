import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify, errors as joseErrors } from 'jose';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Remote JWKS set fetched from Supabase's well-known endpoint.
 * The key set is cached and rotated automatically by jose.
 */
const JWKS_URL = new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`);
const jwks = createRemoteJWKSet(JWKS_URL);

/**
 * Express middleware that verifies a Supabase-issued JWT.
 *
 * - Extracts Bearer token from the Authorization header
 * - Verifies signature against the Supabase JWKS
 * - Attaches decoded payload to `req.user`
 * - Returns 401 on missing, malformed, expired, or invalid tokens
 */
export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Missing or malformed Authorization header',
          code: 'AUTH_MISSING_TOKEN',
        },
      });
      return;
    }

    const token = authHeader.slice(7); // Strip "Bearer "

    const { payload } = await jwtVerify(token, jwks, {
      issuer: `${env.SUPABASE_URL}/auth/v1`,
    });

    if (!payload.sub) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Token payload missing subject claim',
          code: 'AUTH_INVALID_TOKEN',
        },
      });
      return;
    }

    // Attach the verified payload to the request object
    req.user = payload as Express.Request['user'];

    next();
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) {
      logger.warn({ err }, 'JWT expired');
      res.status(401).json({
        success: false,
        error: {
          message: 'Token has expired',
          code: 'AUTH_TOKEN_EXPIRED',
        },
      });
      return;
    }

    if (err instanceof joseErrors.JWTClaimValidationFailed) {
      logger.warn({ err }, 'JWT claim validation failed');
      res.status(401).json({
        success: false,
        error: {
          message: 'Token claim validation failed',
          code: 'AUTH_INVALID_CLAIMS',
        },
      });
      return;
    }

    logger.error({ err }, 'JWT verification failed');
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or unverifiable token',
        code: 'AUTH_INVALID_TOKEN',
      },
    });
  }
};
