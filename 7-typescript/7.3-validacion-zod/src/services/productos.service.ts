import * as repo from '../repositories/productos.repository.js';
import { ValidationError } from '../shared/errors.js';
import type { Producto, ProductoNuevo } from '../schemas/producto.schema.js';

// Comparar con el service del 7.2: acá desapareció la validación de FORMATO.
// De que 'nombre' sea un string no vacío y 'precio' un número positivo ya se
// ocupó Zod, antes de llegar al controller.
//
// Lo que queda es lo que Zod no puede saber: las REGLAS DE NEGOCIO, que
// necesitan mirar el estado del sistema.

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
