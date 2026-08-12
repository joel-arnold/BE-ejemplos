import { orm } from '../db.js';
import { Producto } from '../entities/producto.entity.js';
import { Usuario } from '../entities/usuario.entity.js';
import type { ProductoNuevo } from '../schemas/producto.schema.js';

// El repository del 8.2 con dos cambios: `guardar` recibe también al dueño, y
// aparecen findById y eliminar (los necesita el DELETE).

export async function findAll(): Promise<Producto[]> {
  return orm.em.findAll(Producto, { orderBy: { id: 'asc' } });
}

export async function findByNombre(nombre: string): Promise<Producto | null> {
  return orm.em.findOne(Producto, { nombre });
}

// populate: ['creadoPor'] trae al usuario en la MISMA consulta, con un join.
// Sin eso, `producto.creadoPor` viene como una referencia sin cargar y leerle
// el id funciona, pero leerle el email dispara otra consulta (el N+1 de la
// unidad 8). El service necesita el id nada más, pero lo dejamos explícito
// para que la regla de autorización no dependa de ese detalle.
// findOneOrFail lanza NotFoundError si no está, y el errorHandler ya lo
// traduce a un 404 desde la unidad 8. Así el service no tiene que chequear
// null antes de mirar los permisos.
export async function findByIdOrFail(id: number): Promise<Producto> {
  return orm.em.findOneOrFail(Producto, { id }, { populate: ['creadoPor'] });
}

export async function guardar(datos: ProductoNuevo, creadoPor: Usuario): Promise<Producto> {
  const producto = orm.em.create(Producto, { ...datos, creadoPor });
  await orm.em.flush();
  return producto;
}

export async function eliminar(producto: Producto): Promise<void> {
  orm.em.remove(producto);
  await orm.em.flush();
}
