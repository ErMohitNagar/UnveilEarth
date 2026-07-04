import { Request, Response } from 'express';
import { experiencesService } from './experiences.service.js';
import { bookingService } from './booking.service.js';
import { ApiResponse, AppError } from '../../utils/apiResponse.js';
import type { ListExperiencesQuery, ExperienceParams, BookingRequest } from './experiences.schema.js';

export const experiencesController = {
  async list(req: Request, res: Response): Promise<void> {
    const filters = req.query as unknown as ListExperiencesQuery;
    const result = await experiencesService.list(filters);

    ApiResponse.success(res, result.data, 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as ExperienceParams;
    const experience = await experiencesService.getById(id);

    ApiResponse.success(res, experience);
  },

  async book(req: Request, res: Response): Promise<void> {
    const user = req.user;
    if (!user?.sub) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
    }

    const { id } = req.params as unknown as ExperienceParams;
    const bookingData = req.body as BookingRequest;

    const booking = await bookingService.createBooking(user.sub, id, bookingData);

    ApiResponse.created(res, booking);
  },
};
