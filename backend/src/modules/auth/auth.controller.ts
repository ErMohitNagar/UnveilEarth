import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { ApiResponse, AppError } from '../../utils/apiResponse.js';
import type { SyncUserInput } from './auth.schema.js';

export const authController = {
  async sync(req: Request, res: Response): Promise<void> {
    const user = req.user;
    if (!user?.sub || !user?.email) {
      throw new AppError('Invalid token payload', 401, 'AUTH_INVALID_PAYLOAD');
    }

    const profileData = req.body as SyncUserInput;
    const result = await authService.syncUser(user.sub, user.email as string, profileData);

    ApiResponse.success(res, result, 200);
  },
};
