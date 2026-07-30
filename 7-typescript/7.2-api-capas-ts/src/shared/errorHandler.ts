import type { ErrorRequestHandler } from 'express';
import { ValidationError } from './errors.js';

// Middleware transversal: centraliza el manejo de errores en un solo lugar.
//
// En JavaScript, Express reconocía este middleware por tener cuatro parámetros
// y equivocarse en el orden fallaba en silencio. El tipo ErrorRequestHandler ya
// obliga a los cuatro, en el orden correcto: si falta uno, no compila.
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
