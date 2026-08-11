import * as repo from '../repositories/productos.repository.js';
import type { Producto, ProductoNuevo, PayloadToken } from '../domain/producto.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../shared/errors.js';

// ============================================================================
// EL SERVICE TAL COMO ESTÁ EN EL 9.3 — sin tocar una línea
// ============================================================================
// El import de arriba es el que el 10.2 tuvo que sacar. Acá se queda: este
// archivo es el que ya escribieron en su TP, con su repository soldado.
//
// La pregunta de este ejemplo es si igual se puede testear. Se puede: en vez de
// cambiar el service para que reciba otro repository, se le cambia el
// repository POR DEBAJO, interceptando el import.
// ============================================================================

export async function listarProductos(): Promise<Producto[]> {
  return repo.findAll();
}

export async function crearProducto(
  datos: ProductoNuevo,
  autor: PayloadToken,
): Promise<Producto> {
  const existente = await repo.findByNombre(datos.nombre);

  if (existente) {
    throw new ValidationError(`Ya existe un producto llamado "${datos.nombre}"`);
  }

  return repo.guardar(datos, Number(autor.sub));
}

export async function eliminarProducto(id: number, quienPide: PayloadToken): Promise<void> {
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
}
