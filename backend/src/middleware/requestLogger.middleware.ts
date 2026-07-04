import { pinoHttp, type Options } from 'pino-http';
import logger from '../utils/logger.js';

/** Headers that must never appear in logs */
const REDACTED_HEADERS = ['authorization', 'cookie', 'x-api-key'] as const;

const options: Options = {
  logger,

  // Attach a unique request ID when available (e.g. from a reverse proxy)
  genReqId: (req) =>
    (req.headers['x-request-id'] as string) ?? crypto.randomUUID(),

  serializers: {
    req(req: Record<string, unknown>) {
      const rawHeaders = (req.headers ?? {}) as Record<string, string>;
      const headers = { ...rawHeaders };

      for (const header of REDACTED_HEADERS) {
        if (header in headers) {
          headers[header] = '[REDACTED]';
        }
      }

      return {
        id: req.id,
        method: req.method,
        url: req.url,
        headers,
      };
    },

    res(res: Record<string, unknown>) {
      return {
        statusCode: res.statusCode,
      };
    },
  },

  // Don't log health-check noise
  autoLogging: {
    ignore: (req) => req.url === '/health' || req.url === '/api/health',
  },
};

/**
 * HTTP request/response logger powered by `pino-http`.
 *
 * - Shares the application-wide pino instance for consistent formatting
 * - Redacts Authorization, Cookie, and x-api-key headers from logged requests
 * - Automatically logs status code, response time, and content length
 */
export const requestLogger = pinoHttp(options);
