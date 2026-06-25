import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { HttpError } from '../utils/httpError.js';

const publicUserSelect = { id: true, name: true, email: true, role: true, isActive: true };

export async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) throw new HttpError(401, 'Credenciales inválidas');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new HttpError(401, 'Credenciales inválidas');

  const token = jwt.sign({ role: user.role }, process.env.JWT_SECRET, {
    subject: user.id,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive }
  };
}

export async function getMe(id) {
  return prisma.user.findUnique({ where: { id }, select: publicUserSelect });
}
