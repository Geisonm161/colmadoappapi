import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import * as controller from '../controllers/saleController.js';

export const saleRoutes = Router();
saleRoutes.use(authenticate);
saleRoutes.get('/', controller.index);
saleRoutes.post('/', controller.store);
saleRoutes.get('/:id', controller.show);
