import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const index = asyncHandler(async (_req, res) => {
  res.json(await prisma.alert.findMany({
    where: { isResolved: false },
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  }));
});

export const resolve = asyncHandler(async (req, res) => {
  res.json(await prisma.alert.update({
    where: { id: req.params.id },
    data: { isResolved: true, resolvedAt: new Date() }
  }));
});
