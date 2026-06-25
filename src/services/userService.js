import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { badRequest, notFound } from '../utils/httpError.js';

export const publicUserSelect = { id: true, name: true, email: true, role: true, isActive: true, createdAt: true };

export function listUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: publicUserSelect });
}

export async function createUser(data) {
  if (!['ADMIN', 'EMPLOYEE'].includes(data.role)) throw badRequest('Rol inválido');
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw badRequest('Ya existe un usuario con ese correo');
  const passwordHash = await bcrypt.hash(data.password, 12);
  return prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash, role: data.role },
    select: publicUserSelect
  });
}

export async function updateUser(id, data) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw notFound('Usuario no encontrado');
  const update = { name: data.name, email: data.email, role: data.role };
  if (data.password) update.passwordHash = await bcrypt.hash(data.password, 12);
  return prisma.user.update({ where: { id }, data: update, select: publicUserSelect });
}

export async function setUserStatus(id, isActive) {
  return prisma.user.update({ where: { id }, data: { isActive: Boolean(isActive) }, select: publicUserSelect });
}
