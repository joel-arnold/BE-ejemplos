import jwt from 'jsonwebtoken';
import type { PayloadToken } from '../domain/producto.js';

// El JWT de la unidad 9, recortado a lo mínimo. El secret sale del entorno con
// un valor por defecto SOLO porque es un ejemplo: en el 9.3 la API no arranca
// si falta, y así tiene que ser.
const SECRET = process.env.JWT_SECRET ?? 'secreto-de-ejemplo-no-usar-en-serio';

export function emitirToken(payload: PayloadToken): string {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

export function verificarToken(token: string): PayloadToken {
  // verify(), nunca decode(): decode() lee el payload sin chequear la firma.
  return jwt.verify(token, SECRET) as PayloadToken;
}
