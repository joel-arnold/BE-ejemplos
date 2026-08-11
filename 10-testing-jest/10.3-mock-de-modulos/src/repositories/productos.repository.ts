import type { Producto, ProductoNuevo } from '../domain/producto.js';

// ============================================================================
// EL REPOSITORY DEL 9.3 — funciones sueltas, sin contrato explícito
// ============================================================================
// A diferencia del 10.2, acá no hay ningún tipo `ProductosRepository`. Son
// cinco funciones exportadas, exactamente como en las unidades 6 a 9. El
// "contrato" es el conjunto de exports del archivo.
//
// En el 9.3 cada una de estas funciones es una línea de MikroORM contra MySQL.
// Acá están en memoria para que el ejemplo corra sin base, pero da lo mismo:
// el test de al lado NUNCA las ejecuta.
// ============================================================================

const productos: Producto[] = [
  { id: 1, nombre: 'Mate', precio: 5000, creadoPorId: 1 },
  { id: 2, nombre: 'Bombilla', precio: 2000, creadoPorId: 2 },
];

let proximoId = 3;

export async function findAll(): Promise<Producto[]> {
  return [...productos];
}

export async function findByNombre(nombre: string): Promise<Producto | null> {
  return productos.find((p) => p.nombre === nombre) ?? null;
}

export async function findById(id: number): Promise<Producto | null> {
  return productos.find((p) => p.id === id) ?? null;
}

export async function guardar(datos: ProductoNuevo, creadoPorId: number): Promise<Producto> {
  const producto: Producto = { id: proximoId++, ...datos, creadoPorId };
  productos.push(producto);
  return producto;
}

export async function eliminar(producto: Producto): Promise<void> {
  const indice = productos.findIndex((p) => p.id === producto.id);
  if (indice !== -1) productos.splice(indice, 1);
}
