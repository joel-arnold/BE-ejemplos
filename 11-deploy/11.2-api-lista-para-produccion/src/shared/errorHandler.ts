import type { ErrorRequestHandler } from 'express';
import { NotFoundError, UniqueConstraintViolationException } from '@mikro-orm/core';
import { ValidationError, UnauthorizedError, ForbiddenError } from './errors.js';
import { esProduccion } from '../config/env.js';

// El errorHandler de las unidades 8 y 9, con lo que hace falta cuando el que
// llama a la API es cualquiera de internet y no vos con un archivo .http.
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

  // ==========================================================================
  // EL 500: LO QUE NO PREVIMOS
  // ==========================================================================
  // Esto ya estaba bien desde la unidad 8, y en producción pasa de ser
  // prolijidad a ser seguridad: el stack trace de un error de base de datos
  // incluye la consulta, los nombres de las tablas y a veces los datos.
  // Mandárselo a quien te pegó a la API es regalarle el mapa del sistema.
  //
  // Lo que se agrega acá es un identificador. En tu máquina, cuando algo
  // explota, mirás la consola. En producción no hay consola: hay un usuario
  // diciendo "me tiró error" y un log con miles de líneas. El id que ve el
  // usuario es el mismo que quedó escrito en el log, y encontrarlo pasa de
  // adivinanza a búsqueda.
  // ==========================================================================
  const id = Math.random().toString(36).slice(2, 10);

  console.error(`[error ${id}]`, err);

  res.status(500).json({
    error: 'Error interno del servidor',
    id,
    // Fuera de producción, el detalle va también en la respuesta: es cómodo y
    // no hay a quién filtrárselo. El `esProduccion` es lo único que separa una
    // cosa de la otra, y por eso NODE_ENV no puede quedar mal seteado.
    ...(esProduccion ? {} : { detalle: err instanceof Error ? err.message : String(err) }),
  });
};
