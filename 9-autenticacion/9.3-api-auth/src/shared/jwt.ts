import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { Rol } from '../entities/usuario.entity.js';

// ============================================================================
// EMITIR Y VERIFICAR TOKENS - todo el trato con jsonwebtoken vive acá
// ============================================================================
// Ninguna otra parte de la aplicación importa 'jsonwebtoken'. Es la misma idea
// del repository de la unidad 6: si mañana se cambia a `jose`, o a sesiones en
// vez de tokens, se toca este archivo y nada más.
// ============================================================================

// Lo que el servidor afirma sobre el portador del token.
//
// `sub` (subject) es el claim estándar para "de quién habla este token". Va
// como string porque así lo pide el RFC, aunque nuestro id sea un number.
//
// Ojo con lo que NO está: el passwordHash, la fecha de nacimiento, nada
// privado. El payload se lee sin el secret (ejemplo 9.2.1).
export interface PayloadToken {
  sub: string;
  email: string;
  rol: Rol;
}

export function emitirToken(payload: PayloadToken): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    // El cast es el precio de leer la duración de una variable de entorno: los
    // tipos de jsonwebtoken esperan un literal como '1h' o '15m', y del .env
    // sale un string cualquiera. Zod ya lo validó como string; que sea una
    // duración válida lo verifica jsonwebtoken al arrancar.
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verificarToken(token: string): PayloadToken {
  // `algorithms` no es opcional por paranoia: fija cuál se acepta en vez de
  // dejar que lo decida el header del token, que lo controla quien lo manda
  // (ejemplo 9.2.2, nivel 3).
  //
  // verify() lanza si la firma no cierra o si el token venció. Quien llama se
  // encarga de traducir eso a un 401.
  return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as PayloadToken;
}
