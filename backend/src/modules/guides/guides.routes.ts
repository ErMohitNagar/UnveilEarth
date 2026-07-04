import { Router } from 'express';
import { guidesController } from './guides.controller.js';
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js';
import { requireRole } from '../../middleware/requireRole.middleware.js';
import { validate } from '../../middleware/validateRequest.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { GuideOnboardSchema } from './guides.schema.js';

const router = Router();

/** POST /api/guides/onboard — Local guide/artisan signup (role: guide or admin) */
router.post(
  '/onboard',
  verifyJwt,
  requireRole('guide', 'admin'),
  validate({ body: GuideOnboardSchema }),
  asyncHandler(guidesController.onboard),
);

export default router;
