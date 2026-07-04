import { Router } from 'express';
import { eventsController } from './events.controller.js';
import { validate } from '../../middleware/validateRequest.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ListEventsQuerySchema } from './events.schema.js';

const router = Router();

/** GET /api/events — List events, filterable by destination/date */
router.get(
  '/',
  validate({ query: ListEventsQuerySchema }),
  asyncHandler(eventsController.list),
);

export default router;
