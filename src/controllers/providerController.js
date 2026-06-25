import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../middlewares/validate.js';
import * as providerService from '../services/providerService.js';

export const index = asyncHandler(async (_req, res) => res.json(await providerService.listProviders()));

export const store = asyncHandler(async (req, res) => {
  requireFields(req.body, ['name', 'phone', 'address']);
  res.status(201).json(await providerService.createProvider(req.body));
});

export const update = asyncHandler(async (req, res) => {
  requireFields(req.body, ['name', 'phone', 'address']);
  res.json(await providerService.updateProvider(req.params.id, req.body));
});

export const destroy = asyncHandler(async (req, res) => res.json(await providerService.deactivateProvider(req.params.id)));
