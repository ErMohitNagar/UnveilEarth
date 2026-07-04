import { Router } from 'express';
import { authController } from './auth.controller.js';
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js';
import { validate } from '../../middleware/validateRequest.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { SyncUserSchema } from './auth.schema.js';

const router = Router();

/** POST /api/auth/sync — Sync Supabase user into local profile */
router.post(
  '/sync',
  verifyJwt,
  validate({ body: SyncUserSchema }),
  asyncHandler(authController.sync),
);

export default router;
