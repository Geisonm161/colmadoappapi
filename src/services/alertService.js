import { prisma } from '../config/prisma.js';
import { daysFromNow } from '../utils/dates.js';

export async function createAlertIfNeeded(client, product, type, message) {
  const db = client || prisma;
  const existing = await db.alert.findFirst({
    where: { productId: product.id, type, isResolved: false }
  });
  if (existing) return existing;
  return db.alert.create({ data: { productId: product.id, type, message } });
}

export async function evaluateProductAlerts(product, client = prisma) {
  if (!product?.isActive) return;

  if (product.stock <= 0) {
    await createAlertIfNeeded(client, product, 'OUT_OF_STOCK', `${product.name} está agotado.`);
  } else if (product.stock <= product.minStock) {
    await createAlertIfNeeded(client, product, 'LOW_STOCK', `${product.name} tiene inventario bajo.`);
  }

  if (product.expirationDate && new Date(product.expirationDate) <= daysFromNow(7)) {
    await createAlertIfNeeded(client, product, 'EXPIRING_SOON', `${product.name} vence en 7 días o menos.`);
  }
}

export async function evaluateAllAlerts() {
  const products = await prisma.product.findMany({ where: { isActive: true } });
  await Promise.all(products.map((product) => evaluateProductAlerts(product)));
}
