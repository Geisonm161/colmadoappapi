import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../middlewares/validate.js';
import * as userService from '../services/userService.js';

export const index = asyncHandler(async (_req, res) => res.json(await userService.listUsers()));

export const store = asyncHandler(async (req, res) => {
  requireFields(req.body, ['name', 'email', 'password', 'role']);
  res.status(201).json(await userService.createUser(req.body));
});

export const update = asyncHandler(async (req, res) => {
  requireFields(req.body, ['name', 'email', 'role']);
  res.json(await userService.updateUser(req.params.id, req.body));
});

export const status = asyncHandler(async (req, res) => {
  res.json(await userService.setUserStatus(req.params.id, req.body.isActive));
});
