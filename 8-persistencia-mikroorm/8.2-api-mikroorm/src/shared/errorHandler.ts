import type { ErrorRequestHandler } from 'express';
import { NotFoundError, UniqueConstraintViolationException } from '@mikro-orm/core';
import { ValidationError } from './errors.js';

// El errorHandler de la unidad 6, con dos casos nuevos que aparecen recién
// ahora que hay una base de datos atrás.
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }

  // findOneOrFail lanza esto cuando no encuentra la fila. Traducirlo acá evita
  // tener que chequear null en cada controller.
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: 'Recurso no encontrado' });
    return;
  }

  // El índice único de la columna `nombre` se violó. Se llega acá aunque el
  // service ya haya chequeado que no exista: entre ese SELECT y el INSERT pasa
  // un instante, y dos requests simultáneos con el mismo nombre pueden pasar
  // los dos el chequeo. El que pierde la carrera lo corta la base.
  //
  // La regla general: la validación en la aplicación da buenos mensajes; la
  // restricción en la base es la que de verdad garantiza el dato.
  if (err instanceof UniqueConstraintViolationException) {
    res.status(409).json({ error: 'Ya existe un registro con ese valor único' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
