import { guidesRepository } from './guides.repository.js';
import { AppError } from '../../utils/apiResponse.js';
import logger from '../../utils/logger.js';
import type { GuideOnboardInput } from './guides.schema.js';

export const guidesService = {
  /**
   * Onboard a new local guide/artisan.
   * Checks for existing registration, then creates the guide profile.
   */
  async onboard(userId: string, data: GuideOnboardInput) {
    // Check if user is already registered as a guide
    const existing = await guidesRepository.findByUserId(userId);
    if (existing) {
      throw new AppError(
        'User is already registered as a guide',
        409,
        'GUIDE_ALREADY_EXISTS',
      );
    }

    const guide = await guidesRepository.create(userId, data);
    logger.info({ guideId: guide.id, userId }, '[guides] Guide onboarded successfully');

    return guide;
  },
};
