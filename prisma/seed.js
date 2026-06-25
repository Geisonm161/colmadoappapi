import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@colmadoapp.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin12345';
  const adminName = process.env.ADMIN_NAME || 'Administrador';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: adminName, passwordHash, role: 'ADMIN', isActive: true },
    create: { name: adminName, email: adminEmail, passwordHash, role: 'ADMIN' }
  });

  const provider = await prisma.provider.upsert({
    where: { id: 'seed-provider-1' },
    update: {},
    create: {
      id: 'seed-provider-1',
      name: 'Distribuidora Duarte',
      phone: '809-555-0101',
      address: 'Santo Domingo',
      email: 'ventas@duarte.test',
      notes: 'Proveedor inicial de prueba'
    }
  });

  await prisma.product.upsert({
    where: { code: 'ARROZ-001' },
    update: {},
    create: {
      code: 'ARROZ-001',
      name: 'Arroz Selecto 5 lb',
      category: 'Viveres',
      purchasePrice: 210,
      salePrice: 260,
      stock: 18,
      minStock: 5,
      providerId: provider.id
    }
  });

  await prisma.product.upsert({
    where: { code: 'LECHE-001' },
    update: {},
    create: {
      code: 'LECHE-001',
      name: 'Leche evaporada',
      category: 'Lacteos',
      purchasePrice: 55,
      salePrice: 75,
      stock: 4,
      minStock: 6,
      expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      providerId: provider.id
    }
  });

  console.log(`Seed listo. Administrador: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
