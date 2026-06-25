import { asyncHandler } from '../utils/asyncHandler.js';
import * as saleService from '../services/saleService.js';

export const index = asyncHandler(async (req, res) => res.json(await saleService.listSales(req.query)));
export const show = asyncHandler(async (req, res) => res.json(await saleService.getSale(req.params.id)));
export const store = asyncHandler(async (req, res) => res.status(201).json(await saleService.createSale(req.body, req.user.id)));
