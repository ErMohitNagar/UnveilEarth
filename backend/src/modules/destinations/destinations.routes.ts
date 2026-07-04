import { Router } from 'express';
import { destinationsController } from './destinations.controller.js';
import { validate } from '../../middleware/validateRequest.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ListDestinationsQuerySchema, DestinationParamsSchema } from './destinations.schema.js';

const router = Router();

/** GET /api/destinations — List/search destinations with filters */
router.get(
  '/',
  validate({ query: ListDestinationsQuerySchema }),
  asyncHandler(destinationsController.list),
);

/** GET /api/destinations/:slug — Get destination detail with AI story */
router.get(
  '/:slug',
  validate({ params: DestinationParamsSchema }),
  asyncHandler(destinationsController.getBySlug),
);

export default router;
