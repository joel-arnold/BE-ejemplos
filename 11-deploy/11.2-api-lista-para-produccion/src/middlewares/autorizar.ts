import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../shared/errors.js';
import type { Rol } from '../entities/usuario.entity.js';

// ============================================================================
// AUTORIZACIÓN: ¿PODÉS HACER ESTO?
// ============================================================================
// Autenticar es una sola pregunta con una sola respuesta posible: quién sos.
// Autorizar son muchas preguntas distintas, una por regla del sistema. Por eso
// no hay UN middleware de autorización: hay una fábrica que produce el que
// hace falta en cada ruta.
//
// Es una función de orden superior (unidad 2): requiereRol('admin') no es el
// middleware, DEVUELVE el middleware. El mismo patrón que validar(schema) en
// la unidad 7.
// ============================================================================

export function requiereRol(...rolesPermitidos: Rol[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Si esto pasa, la ruta está mal armada: requiereRol se puso sin
    // autenticar delante. Vale chequearlo igual — un olvido acá deja una ruta
    // de admin abierta, y el error se ve en el código, no en las pruebas.
    if (!req.usuario) {
      next(new UnauthorizedError('Falta el token de autenticación'));
      return;
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      // 403, no 401: sabemos perfectamente quién es. Volver a loguearse no lo
      // va a convertir en admin.
      next(new ForbiddenError('No tenés permiso para esta operación'));
      return;
    }

    next();
  };
}

// ============================================================================
// LO QUE ESTE ARCHIVO NO PUEDE RESOLVER
// ============================================================================
// Hay dos clases de autorización, y solo una entra en un middleware:
//
//   a) La que depende SOLO del token.
//      "Tenés que ser admin." Se sabe con lo que trae el request, antes de
//      tocar la base. Eso es requiereRol, acá arriba.
//
//   b) La que depende DEL RECURSO.
//      "Podés borrar este producto si lo creaste vos." No se puede responder
//      sin ir a buscar el producto y ver de quién es.
//
// La (b) NO va en un middleware. Si la pusiéramos acá, el middleware tendría
// que consultar la base y después el service la consultaría de nuevo: dos
// veces la misma query, y una regla de negocio escrita en la capa equivocada.
//
// Va en el SERVICE, junto al resto de las reglas de negocio — ver
// eliminarProducto() en services/productos.service.ts.
//
// La regla práctica para decidir dónde poner cada una: si para contestar hace
// falta ir a la base, es del service.
// ============================================================================
