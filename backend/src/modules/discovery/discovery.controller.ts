import { Request, Response } from 'express';
import { discoveryService } from './discovery.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import type { RecommendationRequestInput, HiddenGemsRequestInput } from './discovery.schema.js';

export const discoveryController = {
  async recommendations(req: Request, res: Response): Promise<void> {
    const input = req.body as RecommendationRequestInput;
    const results = await discoveryService.getRecommendations(input);

    ApiResponse.success(res, results);
  },

  async hiddenGems(req: Request, res: Response): Promise<void> {
    const input = req.body as HiddenGemsRequestInput;
    const results = await discoveryService.findHiddenGems(input);

    ApiResponse.success(res, results);
  },
};
