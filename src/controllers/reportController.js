import { asyncHandler } from '../utils/asyncHandler.js';
import * as reportService from '../services/reportService.js';

export const dashboard = asyncHandler(async (_req, res) => res.json(await reportService.dashboard()));
export const salesDaily = asyncHandler(async (_req, res) => res.json(await reportService.salesGrouped('daily')));
export const salesWeekly = asyncHandler(async (_req, res) => res.json(await reportService.salesGrouped('weekly')));
export const salesMonthly = asyncHandler(async (_req, res) => res.json(await reportService.salesGrouped('monthly')));
export const topProducts = asyncHandler(async (_req, res) => res.json(await reportService.topProducts()));
export const inventory = asyncHandler(async (_req, res) => res.json(await reportService.inventoryReport()));
export const cashClosing = asyncHandler(async (req, res) => res.json(await reportService.cashClosing(req.query.date)));
