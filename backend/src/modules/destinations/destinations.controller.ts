import { Request, Response } from 'express';
import { destinationsService } from './destinations.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import type { ListDestinationsQuery, DestinationParams } from './destinations.schema.js';

export const destinationsController = {
  async list(req: Request, res: Response): Promise<void> {
    const filters = req.query as unknown as ListDestinationsQuery;
    const result = await destinationsService.list(filters);

    ApiResponse.success(res, result.data, 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  },

  async getBySlug(req: Request, res: Response): Promise<void> {
    const { slug } = req.params as unknown as DestinationParams;
    const destination = await destinationsService.getBySlug(slug);

    ApiResponse.success(res, destination);
  },
};
