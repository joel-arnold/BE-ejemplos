import type { PayloadToken } from '../shared/jwt.js';

// ============================================================================
// AGREGARLE UNA PROPIEDAD A Request, SIN MENTIRLE AL COMPILADOR
// ============================================================================
// El middleware de autenticación deja el usuario en `req.usuario`. Pero
// `Request` es un tipo de Express y no tiene esa propiedad: sin esto, el
// compilador rechaza tanto escribirla como leerla.
//
// La solución NO es `(req as any).usuario`. Es DECLARATION MERGING: TypeScript
// permite reabrir una interface declarada en otro paquete y sumarle campos.
// Todo lo que esté en el mismo namespace se fusiona.
//
// El `?` es importante y no es un detalle de sintaxis: en una ruta pública
// (GET /api/productos) el middleware no corrió y `req.usuario` es undefined.
// El tipo lo dice, y el compilador obliga a contemplarlo. Si fuera obligatorio,
// el tipo estaría mintiendo — que es exactamente lo que la unidad 7 pide no
// hacer.
// ============================================================================

declare global {
  namespace Express {
    interface Request {
      usuario?: PayloadToken;
    }
  }
}

// Sin al menos un import o export, TypeScript trata este archivo como un
// script global y `declare global` no compila.
export {};
