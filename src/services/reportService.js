import { prisma } from '../config/prisma.js';
import { dayRange, daysFromNow, formatLocalDate } from '../utils/dates.js';

export async function dashboard() {
  const { start, end } = dayRange();
  const [salesToday, latestSales, products, expiring, outOfStock, activeAlerts] = await Promise.all([
    prisma.sale.aggregate({ where: { createdAt: { gte: start, lt: end } }, _sum: { total: true }, _count: true }),
    prisma.sale.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } }, items: true } }),
    prisma.product.findMany({ where: { isActive: true }, orderBy: { stock: 'asc' } }),
    prisma.product.findMany({ where: { isActive: true, expirationDate: { lte: daysFromNow(7), gte: new Date() } }, take: 10 }),
    prisma.product.findMany({ where: { isActive: true, stock: { lte: 0 } }, take: 10 }),
    prisma.alert.findMany({ where: { isResolved: false }, include: { product: true }, orderBy: { createdAt: 'desc' } })
  ]);

  return {
    totalSoldToday: Number(salesToday._sum.total || 0),
    salesCountToday: salesToday._count,
    latestSales,
    lowStock: products.filter((product) => product.stock > 0 && product.stock <= product.minStock).slice(0, 10),
    expiring,
    outOfStock,
    activeAlerts,
    activeAlertCount: activeAlerts.length
  };
}

export async function salesGrouped(period) {
  const sales = await prisma.sale.findMany({ orderBy: { createdAt: 'asc' } });
  const grouped = new Map();
  for (const sale of sales) {
    const date = new Date(sale.createdAt);
    const key = period === 'monthly'
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      : period === 'weekly'
        ? `${date.getFullYear()}-S${Math.ceil((((date - new Date(date.getFullYear(), 0, 1)) / 86400000) + 1) / 7)}`
        : date.toISOString().slice(0, 10);
    grouped.set(key, (grouped.get(key) || 0) + Number(sale.total));
  }
  return [...grouped.entries()].map(([date, total]) => ({ date, total }));
}

export async function topProducts() {
  return topProductsForRange();
}

async function topProductsForRange(range) {
  const saleWhere = range ? { sale: { createdAt: { gte: range.start, lt: range.end } } } : {};
  const items = await prisma.saleItem.groupBy({
    by: ['productId'],
    where: saleWhere,
    _sum: { quantity: true, subtotal: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 10
  });
  const products = await prisma.product.findMany({ where: { id: { in: items.map((item) => item.productId) } } });
  const names = new Map(products.map((product) => [product.id, product.name]));
  return items.map((item) => ({
    productId: item.productId,
    name: names.get(item.productId),
    quantity: item._sum.quantity,
    total: Number(item._sum.subtotal || 0)
  }));
}

export async function inventoryReport() {
  const [products, outOfStock, expiring] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, orderBy: { stock: 'asc' } }),
    prisma.product.findMany({ where: { isActive: true, stock: { lte: 0 } } }),
    prisma.product.findMany({ where: { isActive: true, expirationDate: { lte: daysFromNow(7), gte: new Date() } } })
  ]);
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= product.minStock);
  return { lowStock, outOfStock, expiring, restockSuggested: lowStock.concat(outOfStock) };
}

export async function cashClosing(dateValue) {
  const { start, end } = dayRange(dateValue);
  const sales = await prisma.sale.findMany({
    where: { createdAt: { gte: start, lt: end } },
    include: { user: { select: { name: true } }, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  });
  const byMethod = sales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + Number(sale.total);
    return acc;
  }, {});
  return {
    date: formatLocalDate(start),
    totalSold: sales.reduce((sum, sale) => sum + Number(sale.total), 0),
    salesCount: sales.length,
    byMethod,
    sales,
    topProducts: await topProductsForRange({ start, end })
  };
}
