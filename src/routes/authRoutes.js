import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import * as controller from '../controllers/authController.js';

export const authRoutes = Router();
authRoutes.post('/login', controller.login);
authRoutes.get('/me', authenticate, controller.me);
