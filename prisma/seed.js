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

  const products = [
    {
      code: 'ARROZ-001',
      name: 'Arroz Selecto 5 lb',
      category: 'Viveres',
      purchasePrice: 210,
      salePrice: 260,
      stock: 18,
      minStock: 5
    },
    {
      code: 'LECHE-001',
      name: 'Leche evaporada',
      category: 'Lacteos',
      purchasePrice: 55,
      salePrice: 75,
      stock: 4,
      minStock: 6,
      expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
      code: 'HABICH-001',
      name: 'Habichuelas rojas 1 lb',
      category: 'Viveres',
      purchasePrice: 62,
      salePrice: 85,
      stock: 24,
      minStock: 8
    },
    {
      code: 'AZUCAR-001',
      name: 'Azucar crema 2 lb',
      category: 'Viveres',
      purchasePrice: 70,
      salePrice: 95,
      stock: 20,
      minStock: 6
    },
    {
      code: 'ACEITE-001',
      name: 'Aceite vegetal 16 oz',
      category: 'Viveres',
      purchasePrice: 115,
      salePrice: 150,
      stock: 16,
      minStock: 5
    },
    {
      code: 'PASTA-001',
      name: 'Espaguetis 400 g',
      category: 'Viveres',
      purchasePrice: 28,
      salePrice: 45,
      stock: 30,
      minStock: 10
    },
    {
      code: 'SAL-001',
      name: 'Sal molida 1 lb',
      category: 'Viveres',
      purchasePrice: 18,
      salePrice: 30,
      stock: 35,
      minStock: 10
    },
    {
      code: 'CAFE-001',
      name: 'Cafe molido 8 oz',
      category: 'Bebidas',
      purchasePrice: 145,
      salePrice: 190,
      stock: 10,
      minStock: 4
    },
    {
      code: 'JUGO-001',
      name: 'Jugo de naranja 1 litro',
      category: 'Bebidas',
      purchasePrice: 65,
      salePrice: 90,
      stock: 9,
      minStock: 5,
      expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    },
    {
      code: 'REFRESCO-001',
      name: 'Refresco cola 2 litros',
      category: 'Bebidas',
      purchasePrice: 82,
      salePrice: 115,
      stock: 22,
      minStock: 6
    },
    {
      code: 'AGUA-001',
      name: 'Agua embotellada 16 oz',
      category: 'Bebidas',
      purchasePrice: 12,
      salePrice: 25,
      stock: 48,
      minStock: 15
    },
    {
      code: 'QUESO-001',
      name: 'Queso cheddar 1 lb',
      category: 'Lacteos',
      purchasePrice: 180,
      salePrice: 240,
      stock: 6,
      minStock: 4,
      expirationDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
    },
    {
      code: 'YOGURT-001',
      name: 'Yogurt fresa 1 litro',
      category: 'Lacteos',
      purchasePrice: 85,
      salePrice: 120,
      stock: 5,
      minStock: 5,
      expirationDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    },
    {
      code: 'PAN-001',
      name: 'Pan de agua paquete',
      category: 'Panaderia',
      purchasePrice: 45,
      salePrice: 70,
      stock: 8,
      minStock: 6,
      expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    {
      code: 'GALLETAS-001',
      name: 'Galletas de soda',
      category: 'Snacks',
      purchasePrice: 38,
      salePrice: 60,
      stock: 18,
      minStock: 7
    },
    {
      code: 'CHOCOLATE-001',
      name: 'Chocolate de mesa',
      category: 'Snacks',
      purchasePrice: 32,
      salePrice: 50,
      stock: 12,
      minStock: 5
    },
    {
      code: 'DETERG-001',
      name: 'Detergente en polvo 500 g',
      category: 'Limpieza',
      purchasePrice: 95,
      salePrice: 135,
      stock: 14,
      minStock: 4
    },
    {
      code: 'CLORO-001',
      name: 'Cloro 1 galon',
      category: 'Limpieza',
      purchasePrice: 70,
      salePrice: 105,
      stock: 11,
      minStock: 4
    },
    {
      code: 'JABON-001',
      name: 'Jabon de cuaba',
      category: 'Limpieza',
      purchasePrice: 20,
      salePrice: 35,
      stock: 28,
      minStock: 8
    },
    {
      code: 'PAPEL-001',
      name: 'Papel higienico 4 rollos',
      category: 'Higiene',
      purchasePrice: 105,
      salePrice: 150,
      stock: 13,
      minStock: 5
    },
    {
      code: 'PASTA-DENT-001',
      name: 'Pasta dental familiar',
      category: 'Higiene',
      purchasePrice: 95,
      salePrice: 140,
      stock: 7,
      minStock: 4
    },
    {
      code: 'HUEVOS-001',
      name: 'Carton de huevos 30 unidades',
      category: 'Proteinas',
      purchasePrice: 220,
      salePrice: 285,
      stock: 3,
      minStock: 5,
      expirationDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { code: product.code },
      update: {},
      create: { ...product, providerId: provider.id }
    });
  }

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
