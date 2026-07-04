import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { globalLimiter, aiLimiter, authLimiter } from './middleware/rateLimiter.middleware.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { ApiResponse } from './utils/apiResponse.js';

// Module routes
import authRoutes from './modules/auth/auth.routes.js';
import destinationsRoutes from './modules/destinations/destinations.routes.js';
import discoveryRoutes from './modules/discovery/discovery.routes.js';
import eventsRoutes from './modules/events/events.routes.js';
import experiencesRoutes from './modules/experiences/experiences.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';
import guidesRoutes from './modules/guides/guides.routes.js';

const app = express();

// ─── Security ─────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json({ limit: '1mb' }));

// ─── Logging ──────────────────────────────────────────
app.use(requestLogger);

// ─── Global Rate Limiter ──────────────────────────────
app.use(globalLimiter);

// ─── Health Check ─────────────────────────────────────
// Before module routes — useful for uptime pingers to prevent Render cold starts
app.get('/api/health', (_req, res) => {
  ApiResponse.success(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── API Routes ───────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/discover', aiLimiter, discoveryRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/experiences', experiencesRoutes);
app.use('/api/chat', aiLimiter, chatRoutes);
app.use('/api/guides', guidesRoutes);

// ─── 404 Handler ──────────────────────────────────────
app.use((_req, res) => {
  ApiResponse.error(res, 'Route not found', 404, 'NOT_FOUND');
});

// ─── Centralized Error Handler (must be last) ─────────
app.use(errorHandler);

export default app;
