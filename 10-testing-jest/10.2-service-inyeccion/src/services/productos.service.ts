import type { ProductosRepository } from '../repositories/productos.repository.js';
import type { Producto, ProductoNuevo, PayloadToken } from '../domain/producto.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../shared/errors.js';

// ============================================================================
// EL SERVICE DEL 9.3, CON UN SOLO CAMBIO
// ============================================================================
// En el 9.3 este archivo arrancaba así:
//
//   import * as repo from '../repositories/productos.repository.js';
//
// El service AGARRABA su repository solo. Funciona perfecto en producción y es
// un problema para testear: no hay forma de pedirle que use otro. Ese import
// está soldado.
//
// Acá el repository ENTRA POR PARÁMETRO. El service no elige con quién habla:
// se lo dicen. Eso es inyección de dependencias, y es todo lo que hay que hacer
// para que el service se pueda probar sin base de datos.
//
// En producción se le pasa el repository de MySQL. En los tests, un objeto
// falso. El service no nota la diferencia porque nunca supo cuál era cuál.
// ============================================================================

export function crearProductosService(repo: ProductosRepository) {
  return {
    async listar(): Promise<Producto[]> {
      return repo.findAll();
    },

    // ========================================================================
    // CREAR — el dueño sale del token, no del body
    // ========================================================================
    async crear(datos: ProductoNuevo, autor: PayloadToken): Promise<Producto> {
      const existente = await repo.findByNombre(datos.nombre);

      if (existente) {
        throw new ValidationError(`Ya existe un producto llamado "${datos.nombre}"`);
      }

      return repo.guardar(datos, Number(autor.sub));
    },

    // ========================================================================
    // ELIMINAR — la regla de negocio que vale la pena testear
    // ========================================================================
    // "Solo el que lo creó, o un admin." Tres reglas en cinco líneas, y el
    // ORDEN de los chequeos también es una regla:
    //   1. ¿Existe?        -> si no, 404
    //   2. ¿Tenés permiso? -> si no, 403
    //   3. Borrar
    //
    // Nada de esto necesita una base de datos para probarse. Necesita un
    // producto y un usuario, que son dos objetos literales.
    // ========================================================================
    async eliminar(id: number, quienPide: PayloadToken): Promise<void> {
      const producto = await repo.findById(id);

      if (!producto) {
        throw new NotFoundError(`No existe el producto ${id}`);
      }

      const esAdmin = quienPide.rol === 'admin';
      const esDueno = producto.creadoPorId === Number(quienPide.sub);

      if (!esAdmin && !esDueno) {
        throw new ForbiddenError('Solo podés borrar los productos que creaste');
      }

      await repo.eliminar(producto);
    },
  };
}

// El tipo del objeto que devuelve la fábrica, para que lo usen el controller y
// los tests sin repetir la forma a mano.
export type ProductosService = ReturnType<typeof crearProductosService>;
