import * as repo from '../repositories/productos.repository.js';
import { ValidationError } from '../shared/errors.js';
import { Producto } from '../entities/producto.entity.js';
import type { ProductoNuevo } from '../schemas/producto.schema.js';

// ============================================================================
// EL SERVICE - comparalo línea por línea con el del 7.3
// ============================================================================
// Cambió UNA cosa: de dónde viene el tipo `Producto`. Antes salía del esquema
// de Zod (`z.infer`); ahora es la entidad. El cuerpo de las dos funciones es
// idéntico, carácter por carácter.
//
// Abajo hay MySQL en vez de un array, y el service ni se enteró. Eso es lo que
// se compró al separar las capas en la unidad 6 y al escribir el contrato como
// tipos en la 7: la deuda se cobra hoy.
// ============================================================================

export async function listarProductos(): Promise<Producto[]> {
  return repo.findAll();
}

export async function crearProducto(datos: ProductoNuevo): Promise<Producto> {
  const existente = await repo.findByNombre(datos.nombre);

  if (existente) {
    throw new ValidationError(`Ya existe un producto llamado "${datos.nombre}"`);
  }

  return repo.guardar(datos);
}
