import * as repo from '../repositories/productos.repository.js';
import { ValidationError } from '../shared/errors.js';
import type { Producto, ProductoNuevo } from '../types/producto.js';

// La lógica de negocio, ahora con el contrato explícito: qué recibe y qué
// devuelve. Sigue sin conocer Express ni la base de datos.
//
// Ojo con la validación de abajo: el tipo ProductoNuevo es una promesa sobre el
// código que escribimos nosotros, no sobre los datos que entran por HTTP. Si el
// controller le pasa un req.body sin validar (que es `any`), acá puede llegar
// cualquier cosa. Eso se resuelve en el ejemplo 7.3, con Zod.

export async function listarProductos(): Promise<Producto[]> {
  return repo.findAll();
}

export async function crearProducto(datos: ProductoNuevo): Promise<Producto> {
  if (!datos.nombre || datos.precio <= 0) {
    throw new ValidationError('Datos inválidos');
  }
  return repo.guardar(datos);
}
