import { Request, Response } from 'express';
import { guidesService } from './guides.service.js';
import { ApiResponse, AppError } from '../../utils/apiResponse.js';
import type { GuideOnboardInput } from './guides.schema.js';

export const guidesController = {
  async onboard(req: Request, res: Response): Promise<void> {
    const user = req.user;
    if (!user?.sub) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
    }

    const data = req.body as GuideOnboardInput;
    const guide = await guidesService.onboard(user.sub, data);

    ApiResponse.created(res, guide);
  },
};
