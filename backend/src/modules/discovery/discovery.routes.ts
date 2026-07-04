import { Router } from 'express';
import { discoveryController } from './discovery.controller.js';
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js';
import { validate } from '../../middleware/validateRequest.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { RecommendationRequestSchema, HiddenGemsRequestSchema } from './discovery.schema.js';

const router = Router();

/** POST /api/discover/recommendations — AI-personalized destination recommendations */
router.post(
  '/recommendations',
  verifyJwt,
  validate({ body: RecommendationRequestSchema }),
  asyncHandler(discoveryController.recommendations),
);

/** POST /api/discover/hidden-gems — RAG-powered hidden gem search */
router.post(
  '/hidden-gems',
  verifyJwt,
  validate({ body: HiddenGemsRequestSchema }),
  asyncHandler(discoveryController.hiddenGems),
);

export default router;
