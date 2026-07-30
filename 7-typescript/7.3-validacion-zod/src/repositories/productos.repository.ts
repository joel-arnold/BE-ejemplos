import type { Producto, ProductoNuevo } from '../schemas/producto.schema.js';

// Igual que en 7.2, con una diferencia: los tipos ya no vienen de una interface
// escrita a mano sino del esquema de Zod, vía z.infer. Una sola fuente de
// verdad para validar y para tipar.

const productos: Producto[] = [{ id: 1, nombre: 'Teclado', precio: 25000 }];

export async function findAll(): Promise<Producto[]> {
  return productos;
}

export async function findByNombre(nombre: string): Promise<Producto | undefined> {
  return productos.find((p) => p.nombre.toLowerCase() === nombre.toLowerCase());
}

export async function guardar(datos: ProductoNuevo): Promise<Producto> {
  const nuevo: Producto = { id: productos.length + 1, ...datos };
  productos.push(nuevo);
  return nuevo;
}
