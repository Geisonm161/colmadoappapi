import { Router } from 'express';
import { authRoutes } from './authRoutes.js';
import { userRoutes } from './userRoutes.js';
import { productRoutes } from './productRoutes.js';
import { providerRoutes } from './providerRoutes.js';
import { inventoryRoutes } from './inventoryRoutes.js';
import { saleRoutes } from './saleRoutes.js';
import { alertRoutes } from './alertRoutes.js';
import { reportRoutes } from './reportRoutes.js';

export const routes = Router();

routes.get('/health', (_req, res) => res.json({ status: 'ok', app: 'ColmadoApp' }));
routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/products', productRoutes);
routes.use('/providers', providerRoutes);
routes.use('/inventory', inventoryRoutes);
routes.use('/sales', saleRoutes);
routes.use('/alerts', alertRoutes);
routes.use('/reports', reportRoutes);
