import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../middlewares/validate.js';
import * as inventoryService from '../services/inventoryService.js';

export const index = asyncHandler(async (_req, res) => res.json(await inventoryService.listInventoryEntries()));

export const store = asyncHandler(async (req, res) => {
  requireFields(req.body, ['productId', 'quantity', 'costPrice']);
  res.status(201).json(await inventoryService.createInventoryEntry(req.body, req.user.id));
});
