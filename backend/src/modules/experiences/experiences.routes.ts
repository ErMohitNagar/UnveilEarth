import { Router } from 'express';
import { experiencesController } from './experiences.controller.js';
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js';
import { validate } from '../../middleware/validateRequest.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  ListExperiencesQuerySchema,
  ExperienceParamsSchema,
  BookingRequestSchema,
} from './experiences.schema.js';

const router = Router();

/** GET /api/experiences — List experiences with filters */
router.get(
  '/',
  validate({ query: ListExperiencesQuerySchema }),
  asyncHandler(experiencesController.list),
);

/** GET /api/experiences/:id — Get experience detail */
router.get(
  '/:id',
  validate({ params: ExperienceParamsSchema }),
  asyncHandler(experiencesController.getById),
);

/** POST /api/experiences/:id/book — Create a booking (protected) */
router.post(
  '/:id/book',
  verifyJwt,
  validate({ params: ExperienceParamsSchema, body: BookingRequestSchema }),
  asyncHandler(experiencesController.book),
);

export default router;
