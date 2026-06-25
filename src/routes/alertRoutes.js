import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import * as controller from '../controllers/alertController.js';

export const alertRoutes = Router();
alertRoutes.use(authenticate);
alertRoutes.get('/', controller.index);
alertRoutes.patch('/:id/resolve', controller.resolve);
