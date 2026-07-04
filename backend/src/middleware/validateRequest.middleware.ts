import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiResponse } from '../utils/apiResponse.js';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Factory that returns middleware validating `req.body`, `req.query`,
 * and/or `req.params` against the supplied Zod schemas.
 *
 * On success, each validated field is replaced with the parsed output
 * so downstream handlers benefit from Zod's type coercion and defaults.
 *
 * On failure, returns a 400 response with structured validation errors.
 *
 * @example
 *   router.post(
 *     '/destinations',
 *     validate({ body: createDestinationSchema }),
 *     handler,
 *   );
 */
export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const targets = [
      { key: 'body' as const, schema: schemas.body },
      { key: 'query' as const, schema: schemas.query },
      { key: 'params' as const, schema: schemas.params },
    ];

    for (const { key, schema } of targets) {
      if (!schema) continue;

      const result = schema.safeParse(req[key]);

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;

        ApiResponse.error(
          res,
          `Validation failed for request ${key}`,
          400,
          'VALIDATION_ERROR',
          fieldErrors,
        );
        return;
      }

      // Replace with parsed data (applies defaults, coercion, transforms)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      (req as any)[key] = result.data;
    }

    next();
  };
};
