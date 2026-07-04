import { Request, Response } from 'express';
import { eventsService } from './events.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import type { ListEventsQuery } from './events.schema.js';

export const eventsController = {
  async list(req: Request, res: Response): Promise<void> {
    const filters = req.query as unknown as ListEventsQuery;
    const result = await eventsService.list(filters);

    ApiResponse.success(res, result.data, 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  },
};
