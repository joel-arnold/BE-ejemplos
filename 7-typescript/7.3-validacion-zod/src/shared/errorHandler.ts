import type { ErrorRequestHandler } from 'express';
import { ValidationError } from './errors.js';

// Middleware transversal: centraliza el manejo de errores en un solo lugar.
// El tipo ErrorRequestHandler obliga a los cuatro parámetros, en orden.
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
