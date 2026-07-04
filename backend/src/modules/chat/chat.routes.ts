import { Router } from 'express';
import { chatController } from './chat.controller.js';
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js';
import { validate } from '../../middleware/validateRequest.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ChatRequestSchema } from './chat.schema.js';

const router = Router();

/** POST /api/chat — Streamed chat completion via Groq with conversation context */
router.post(
  '/',
  verifyJwt,
  validate({ body: ChatRequestSchema }),
  asyncHandler(chatController.chat),
);

export default router;
