import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import * as controller from '../controllers/providerController.js';

export const providerRoutes = Router();
providerRoutes.use(authenticate);
providerRoutes.get('/', controller.index);
providerRoutes.post('/', authorize('ADMIN'), controller.store);
providerRoutes.put('/:id', authorize('ADMIN'), controller.update);
providerRoutes.delete('/:id', authorize('ADMIN'), controller.destroy);
