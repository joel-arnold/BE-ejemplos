import type { RequestHandler } from 'express';
import { verificarToken } from '../shared/jwt.js';
import { UnauthorizedError } from '../shared/errors.js';
import type { PayloadToken } from '../domain/producto.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      usuario?: PayloadToken;
    }
  }
}

// El middleware de la unidad 9. Los tests del 10.4 lo atraviesan de verdad:
// firman un token real y lo mandan en el header, igual que lo haría el front.
export const autenticar: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Falta el token'));
  }

  try {
    req.usuario = verificarToken(header.slice('Bearer '.length));
    next();
  } catch {
    next(new UnauthorizedError('Token inválido o vencido'));
  }
};
