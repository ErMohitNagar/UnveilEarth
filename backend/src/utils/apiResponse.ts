import { Response } from 'express';

/**
 * Standardized API response shape.
 * Every endpoint returns this structure so the frontend can parse
 * responses consistently and render accessible error states.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export type ApiResponseShape<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Helper class for sending consistent API responses.
 */
export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode = 200, meta?: ApiSuccessResponse<T>['meta']): void {
    const response: ApiSuccessResponse<T> = { success: true, data };
    if (meta) {
      response.meta = meta;
    }
    res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T): void {
    ApiResponse.success(res, data, 201);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500,
    code?: string,
    details?: unknown,
  ): void {
    const errorObj: ApiErrorResponse['error'] = { message };
    if (code) errorObj.code = code;
    if (details) errorObj.details = details;

    const response: ApiErrorResponse = {
      success: false,
      error: errorObj,
    };
    res.status(statusCode).json(response);
  }
}

/**
 * Custom application error with HTTP status code.
 * Throw this from services/controllers — the centralized error handler will format it.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
