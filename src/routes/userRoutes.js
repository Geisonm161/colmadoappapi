import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import * as controller from '../controllers/userController.js';

export const userRoutes = Router();
userRoutes.use(authenticate, authorize('ADMIN'));
userRoutes.get('/', controller.index);
userRoutes.post('/', controller.store);
userRoutes.put('/:id', controller.update);
userRoutes.patch('/:id/status', controller.status);
