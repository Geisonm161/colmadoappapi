import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../middlewares/validate.js';
import * as productService from '../services/productService.js';

export const index = asyncHandler(async (req, res) => res.json(await productService.listProducts(req.query)));
export const show = asyncHandler(async (req, res) => res.json(await productService.getProduct(req.params.id)));

export const store = asyncHandler(async (req, res) => {
  requireFields(req.body, ['code', 'name', 'category', 'purchasePrice', 'salePrice', 'stock', 'minStock']);
  res.status(201).json(await productService.createProduct(req.body));
});

export const update = asyncHandler(async (req, res) => {
  requireFields(req.body, ['code', 'name', 'category', 'purchasePrice', 'salePrice', 'stock', 'minStock']);
  res.json(await productService.updateProduct(req.params.id, req.body));
});

export const destroy = asyncHandler(async (req, res) => res.json(await productService.deactivateProduct(req.params.id)));
export const lowStock = asyncHandler(async (_req, res) => res.json(await productService.lowStockProducts()));
export const expiring = asyncHandler(async (_req, res) => res.json(await productService.expiringProducts()));
