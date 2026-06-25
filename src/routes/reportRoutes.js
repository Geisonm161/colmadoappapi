import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import * as controller from '../controllers/reportController.js';

export const reportRoutes = Router();
reportRoutes.use(authenticate);
reportRoutes.get('/dashboard', controller.dashboard);
reportRoutes.get('/sales-daily', authorize('ADMIN'), controller.salesDaily);
reportRoutes.get('/sales-weekly', authorize('ADMIN'), controller.salesWeekly);
reportRoutes.get('/sales-monthly', authorize('ADMIN'), controller.salesMonthly);
reportRoutes.get('/top-products', authorize('ADMIN'), controller.topProducts);
reportRoutes.get('/inventory', authorize('ADMIN'), controller.inventory);
reportRoutes.get('/cash-closing', authorize('ADMIN'), controller.cashClosing);
