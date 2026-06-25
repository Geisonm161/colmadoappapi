import { badRequest } from '../utils/httpError.js';

export function requireFields(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
  if (missing.length) throw badRequest(`Campos requeridos: ${missing.join(', ')}`);
}

export function toNumber(value, field) {
  const number = Number(value);
  if (Number.isNaN(number)) throw badRequest(`${field} debe ser numérico`);
  return number;
}

export function toPositiveInt(value, field) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) throw badRequest(`${field} debe ser mayor que cero`);
  return number;
}
