import { JWTPayload } from 'jose';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload & {
        sub: string;
        email?: string;
        role?: string;
        app_metadata?: {
          role?: string;
          provider?: string;
        };
        user_metadata?: Record<string, unknown>;
      };
    }
  }
}

export {};
