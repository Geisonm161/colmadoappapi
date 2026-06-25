import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../middlewares/validate.js';
import * as authService from '../services/authService.js';

export const login = asyncHandler(async (req, res) => {
  requireFields(req.body, ['email', 'password']);
  const result = await authService.login(req.body.email, req.body.password);
  res.json(result);
});

export const me = asyncHandler(async (req, res) => {
  res.json(await authService.getMe(req.user.id));
});
