import { prisma } from '../config/prisma.js';

export function listProviders() {
  return prisma.provider.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
}

export function createProvider(data) {
  return prisma.provider.create({ data });
}

export function updateProvider(id, data) {
  return prisma.provider.update({ where: { id }, data });
}

export function deactivateProvider(id) {
  return prisma.provider.update({ where: { id }, data: { isActive: false } });
}
