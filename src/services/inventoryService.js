import { prisma } from '../config/prisma.js';
import { badRequest } from '../utils/httpError.js';
import { evaluateProductAlerts } from './alertService.js';

export async function createInventoryEntry(data, userId) {
  if (Number(data.quantity) <= 0) throw badRequest('La cantidad debe ser mayor que cero');

  return prisma.$transaction(async (tx) => {
    const entry = await tx.inventoryEntry.create({
      data: {
        productId: data.productId,
        providerId: data.providerId || null,
        quantity: Number(data.quantity),
        costPrice: data.costPrice,
        entryDate: data.entryDate ? new Date(data.entryDate) : new Date(),
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
        userId
      },
      include: { product: true, provider: true, user: true }
    });

    const product = await tx.product.update({
      where: { id: data.productId },
      data: {
        stock: { increment: Number(data.quantity) },
        purchasePrice: data.costPrice,
        providerId: data.providerId || undefined,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined
      }
    });

    await evaluateProductAlerts(product, tx);
    return entry;
  });
}

export function listInventoryEntries() {
  return prisma.inventoryEntry.findMany({
    include: { product: true, provider: true, user: { select: { id: true, name: true } } },
    orderBy: { entryDate: 'desc' }
  });
}
