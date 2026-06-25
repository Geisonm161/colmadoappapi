import { prisma } from '../config/prisma.js';
import { daysFromNow } from '../utils/dates.js';
import { badRequest, notFound } from '../utils/httpError.js';
import { evaluateProductAlerts } from './alertService.js';

const includeProvider = { provider: true };

export async function listProducts(query) {
  const where = {
    isActive: query.includeInactive === 'true' ? undefined : true,
    category: query.category || undefined,
    OR: query.search
      ? [
          { name: { contains: query.search, mode: 'insensitive' } },
          { code: { contains: query.search, mode: 'insensitive' } }
        ]
      : undefined
  };
  return prisma.product.findMany({ where, include: includeProvider, orderBy: { name: 'asc' } });
}

export async function getProduct(id) {
  const product = await prisma.product.findUnique({ where: { id }, include: includeProvider });
  if (!product) throw notFound('Producto no encontrado');
  return product;
}

export async function createProduct(data) {
  const exists = await prisma.product.findUnique({ where: { code: data.code } });
  if (exists) throw badRequest('Ya existe un producto con ese código');
  const product = await prisma.product.create({ data: productPayload(data), include: includeProvider });
  await evaluateProductAlerts(product);
  return product;
}

export async function updateProduct(id, data) {
  await getProduct(id);
  const product = await prisma.product.update({ where: { id }, data: productPayload(data), include: includeProvider });
  await evaluateProductAlerts(product);
  return product;
}

export function deactivateProduct(id) {
  return prisma.product.update({ where: { id }, data: { isActive: false } });
}

export async function lowStockProducts() {
  const products = await prisma.product.findMany({ where: { isActive: true, stock: { gt: 0 } }, orderBy: { stock: 'asc' } });
  return products.filter((product) => product.stock <= product.minStock);
}

export function expiringProducts() {
  return prisma.product.findMany({
    where: { isActive: true, expirationDate: { lte: daysFromNow(7), gte: new Date() } },
    orderBy: { expirationDate: 'asc' }
  });
}

export function outOfStockProducts() {
  return prisma.product.findMany({ where: { isActive: true, stock: { lte: 0 } }, orderBy: { name: 'asc' } });
}

function productPayload(data) {
  return {
    code: data.code,
    name: data.name,
    category: data.category,
    purchasePrice: data.purchasePrice,
    salePrice: data.salePrice,
    stock: Number(data.stock ?? 0),
    minStock: Number(data.minStock ?? 1),
    expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
    providerId: data.providerId || null,
    isActive: data.isActive ?? true
  };
}
