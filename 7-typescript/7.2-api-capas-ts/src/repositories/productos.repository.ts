import type { Producto, ProductoNuevo } from '../types/producto.js';

// El único lugar que sabe DÓNDE y CÓMO viven los datos. Hoy es un array en
// memoria; en la próxima unidad va a ser MikroORM y solo cambia este archivo.
//
// El `import type` importa SOLO el tipo: desaparece por completo al compilar y
// nunca genera un import en el .js. Es lo correcto para algo que no existe en
// tiempo de ejecución.

const productos: Producto[] = [{ id: 1, nombre: 'Teclado', precio: 25000 }];

export async function findAll(): Promise<Producto[]> {
  return productos;
}

export async function guardar(datos: ProductoNuevo): Promise<Producto> {
  const nuevo: Producto = { id: productos.length + 1, ...datos };
  productos.push(nuevo);
  return nuevo;
}
