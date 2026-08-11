import { orm } from '../db.js';
import { Producto } from '../entities/producto.entity.js';
import type { ProductoNuevo } from '../schemas/producto.schema.js';

// ============================================================================
// EL REPOSITORY, AHORA DE VERDAD
// ============================================================================
// Comparar con el repository del 7.3: era un array y un push. Todo lo que
// cambió está en ESTE archivo. Las firmas son las mismas, así que el service
// no se entera de nada — que es exactamente lo que la unidad 6 prometía cuando
// separamos las capas "por si algún día cambia la persistencia".
//
// `orm.em` no es siempre el mismo EntityManager: devuelve el fork del request
// en curso, el que creó el middleware RequestContext en app.ts. Por eso el
// repository puede usarlo directo sin recibirlo por parámetro.
// ============================================================================

export async function findAll(): Promise<Producto[]> {
  return orm.em.findAll(Producto, { orderBy: { id: 'asc' } });
}

export async function findByNombre(nombre: string): Promise<Producto | null> {
  return orm.em.findOne(Producto, { nombre });
}

export async function guardar(datos: ProductoNuevo): Promise<Producto> {
  // create() arma la entidad y la marca para insertar; flush() ejecuta el
  // INSERT. Después del flush, `producto.id` ya tiene el que asignó MySQL.
  const producto = orm.em.create(Producto, datos);
  await orm.em.flush();
  return producto;
}
