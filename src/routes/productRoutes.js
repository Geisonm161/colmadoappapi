import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import * as controller from '../controllers/productController.js';

export const productRoutes = Router();
productRoutes.use(authenticate);
productRoutes.get('/', controller.index);
productRoutes.get('/alerts/low-stock', controller.lowStock);
productRoutes.get('/alerts/expiring', controller.expiring);
productRoutes.get('/:id', controller.show);
productRoutes.post('/', authorize('ADMIN'), controller.store);
productRoutes.put('/:id', authorize('ADMIN'), controller.update);
productRoutes.delete('/:id', authorize('ADMIN'), controller.destroy);
