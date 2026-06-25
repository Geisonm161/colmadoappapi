import { prisma } from '../config/prisma.js';
import { badRequest, notFound } from '../utils/httpError.js';
import { evaluateProductAlerts } from './alertService.js';

export async function createSale(data, userId) {
  if (!Array.isArray(data.items) || data.items.length === 0) throw badRequest('La venta debe tener productos');
  if (!['CASH', 'CARD', 'TRANSFER', 'OTHER'].includes(data.paymentMethod)) throw badRequest('Método de pago inválido');

  return prisma.$transaction(async (tx) => {
    const productIds = data.items.map((item) => item.productId);
    const products = await tx.product.findMany({ where: { id: { in: productIds }, isActive: true } });
    const productMap = new Map(products.map((product) => [product.id, product]));

    let total = 0;
    const saleItems = data.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw notFound('Producto no encontrado o inactivo');
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) throw badRequest('La cantidad debe ser mayor que cero');
      if (product.stock < quantity) throw badRequest(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`);
      const unitPrice = Number(product.salePrice);
      const subtotal = unitPrice * quantity;
      total += subtotal;
      return { product, quantity, unitPrice, subtotal };
    });

    const paidAmount = data.paidAmount === undefined || data.paidAmount === null ? null : Number(data.paidAmount);
    const changeAmount = paidAmount === null ? null : Math.max(paidAmount - total, 0);

    const sale = await tx.sale.create({
      data: {
        userId,
        subtotal: total,
        total,
        paymentMethod: data.paymentMethod,
        paidAmount,
        changeAmount,
        items: {
          create: saleItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal
          }))
        }
      },
      include: { items: { include: { product: true } }, user: { select: { id: true, name: true } } }
    });

    for (const item of saleItems) {
      const updated = await tx.product.update({
        where: { id: item.product.id },
        data: { stock: { decrement: item.quantity } }
      });
      await evaluateProductAlerts(updated, tx);
    }

    return sale;
  });
}

export function listSales(query = {}) {
  const where = {};
  if (query.from || query.to) {
    where.createdAt = {
      gte: query.from ? new Date(query.from) : undefined,
      lte: query.to ? new Date(query.to) : undefined
    };
  }
  return prisma.sale.findMany({
    where,
    include: { items: { include: { product: true } }, user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getSale(id) {
  const sale = await prisma.sale.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, user: { select: { id: true, name: true } } }
  });
  if (!sale) throw notFound('Venta no encontrada');
  return sale;
}
