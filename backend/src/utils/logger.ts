import pino from 'pino';
import { env } from '../config/env.js';

/**
 * Application-wide Pino logger instance.
 * - Development: pretty-printed, colorized output
 * - Production: raw NDJSON for log aggregators
 */
const logger = pino({
  level: env.LOG_LEVEL,
  ...(env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
});

export default logger;
