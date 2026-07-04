import { env } from './config/env.js'; // Triggers env validation — fail fast
import app from './app.js';
import logger from './utils/logger.js';
import { closePool } from './db/pool.js';

const server = app.listen(env.PORT, () => {
  logger.info(`🌍 UnveilEarth API running on port ${env.PORT} [${env.NODE_ENV}]`);
});

// ─── Graceful Shutdown ────────────────────────────────
const shutdown = async (signal: string) => {
  logger.info(`${signal} received — shutting down gracefully`);

  server.close(async () => {
    try {
      await closePool();
      logger.info('Server closed');
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during shutdown');
      process.exit(1);
    }
  });

  // Force exit after 10s if graceful shutdown stalls
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception — shutting down');
  process.exit(1);
});
