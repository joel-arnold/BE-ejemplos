import type { ErrorRequestHandler } from 'express';
import { NotFoundError, UniqueConstraintViolationException } from '@mikro-orm/core';
import { ValidationError, UnauthorizedError, ForbiddenError } from './errors.js';

// El errorHandler de la unidad 8, con los dos casos que trae la autenticación.
// Sigue siendo el único lugar de la aplicación que sabe de códigos HTTP: los
// services lanzan errores de dominio y no se enteran de que existe el 403.
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }

  // ── 401: no sé quién sos ──
  // El header WWW-Authenticate es parte del estándar del 401: le dice al
  // cliente CÓMO autenticarse. Casi nadie lo manda y casi ningún front lo
  // mira, pero es lo correcto y no cuesta nada.
  if (err instanceof UnauthorizedError) {
    res.status(401).set('WWW-Authenticate', 'Bearer').json({ error: err.message });
    return;
  }

  // ── 403: sé quién sos, y no podés ──
  if (err instanceof ForbiddenError) {
    res.status(403).json({ error: err.message });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({ error: 'Recurso no encontrado' });
    return;
  }

  if (err instanceof UniqueConstraintViolationException) {
    res.status(409).json({ error: 'Ya existe un registro con ese valor único' });
    return;
  }

  // El caso que queda es un error que no previmos. Se loguea completo del lado
  // del servidor y al cliente se le manda un mensaje genérico.
  //
  // Esto es una decisión de seguridad, no de prolijidad: el stack trace de un
  // error de base de datos incluye la consulta, los nombres de las tablas y a
  // veces los datos. Mandárselo al cliente es regalar el mapa del sistema.
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
