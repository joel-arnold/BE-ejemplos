import type { ErrorRequestHandler } from 'express';
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from './errors.js';

// ============================================================================
// LA TRADUCCIÓN DE ERROR DE DOMINIO A CÓDIGO HTTP
// ============================================================================
// Esta tabla es justo lo que los tests de service NO pueden verificar: ellos
// comprueban que se lance ForbiddenError, y ahí termina su alcance. Que un
// ForbiddenError salga por la API como 403 y no como 500 se prueba acá, con un
// test que hace un request de verdad.
//
// Es la razón de existir del ejemplo 10.4.
// ============================================================================

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message });
    return;
  }

  if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: error.message });
    return;
  }

  if (error instanceof ForbiddenError) {
    res.status(403).json({ error: error.message });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message });
    return;
  }

  // Lo que no se reconoce es un bug nuestro: 500 y al log. Nunca se le manda
  // el mensaje del error al cliente, que puede tener rutas de archivos o
  // fragmentos de SQL adentro.
  console.error(error);
  res.status(500).json({ error: 'Error interno' });
};
