import type { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../shared/jwt.js';
import { UnauthorizedError } from '../shared/errors.js';

// ============================================================================
// AUTENTICACIÓN: ¿QUIÉN SOS?
// ============================================================================
// Este middleware hace tres cosas y ninguna más:
//
//   1. Saca el token del header Authorization.
//   2. Lo verifica con el secret del servidor.
//   3. Deja el payload en req.usuario para que lo use lo que venga después.
//
// Lo que NO hace: decidir si el usuario puede hacer algo. Eso es autorización
// y va en otro archivo (autorizar.ts) y a veces en el service. Mezclarlas es
// el error más común del tema.
//
// Es un middleware de Express común y silvestre, igual que el `validar` de la
// unidad 7 o el `RequestContext` de la 8. La mecánica ya la conocen: recibe
// (req, res, next), hace su trabajo y llama a next().
// ============================================================================

export function autenticar(req: Request, res: Response, next: NextFunction): void {
  try {
    // El estándar (RFC 6750) dice que el token va así:
    //
    //   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
    //
    // "Bearer" significa "portador": vale por tenerlo, como un boleto de
    // colectivo. No importa quién lo presente.
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Falta el token de autenticación');
    }

    const token = header.slice('Bearer '.length);

    // Si el token está vencido o la firma no cierra, verify() lanza.
    req.usuario = verificarToken(token);

    next();
  } catch (error) {
    // Los errores de jsonwebtoken (TokenExpiredError, JsonWebTokenError) se
    // traducen todos al mismo 401. Al cliente le decimos poco a propósito: que
    // el token esté vencido o mal firmado no es asunto suyo, y detallarlo solo
    // le sirve a quien está probando.
    if (error instanceof UnauthorizedError) {
      next(error);
      return;
    }

    next(new UnauthorizedError('Token inválido o expirado'));
  }
}

// ============================================================================
// LA VARIANTE OPCIONAL
// ============================================================================
// Para rutas que funcionan con y sin usuario: si hay token válido lo usa, y si
// no, sigue de largo. Sirve para un listado que muestra un botón de más cuando
// estás logueado, sin cerrarle la puerta al que no lo está.
//
// No la usamos en esta API, pero vale saber que existe: la diferencia entre
// "requiere token" y "aprovecha el token si está" es una decisión de producto,
// no técnica.
// ============================================================================

export function autenticarOpcional(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (header?.startsWith('Bearer ')) {
    try {
      req.usuario = verificarToken(header.slice('Bearer '.length));
    } catch {
      // Token roto en una ruta opcional: se ignora y se sigue como anónimo.
    }
  }

  next();
}
