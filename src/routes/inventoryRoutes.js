import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import * as controller from '../controllers/inventoryController.js';

export const inventoryRoutes = Router();
inventoryRoutes.use(authenticate);
inventoryRoutes.get('/entries', authorize('ADMIN'), controller.index);
inventoryRoutes.post('/entries', authorize('ADMIN'), controller.store);
