import type { Producto, ProductoNuevo } from '../domain/producto.js';

// ============================================================================
// EL CONTRATO — esto es lo único que el service necesita saber
// ============================================================================
// Un tipo con cinco métodos. No dice MySQL, no dice MikroORM, no dice nada de
// cómo se guardan los productos. Es una lista de lo que el service puede pedir.
//
// Esta es la pieza que hace testeable todo lo demás: el service va a depender
// de ESTE TIPO, no del archivo de abajo. Y un tipo se puede cumplir con un
// objeto de mentira escrito en tres líneas dentro de un test.
// ============================================================================

export type ProductosRepository = {
  findAll(): Promise<Producto[]>;
  findByNombre(nombre: string): Promise<Producto | null>;
  findById(id: number): Promise<Producto | null>;
  guardar(datos: ProductoNuevo, creadoPorId: number): Promise<Producto>;
  eliminar(producto: Producto): Promise<void>;
};

// ============================================================================
// LA IMPLEMENTACIÓN REAL
// ============================================================================
// Acá está en memoria para que el ejemplo corra sin instalar MySQL. En el 9.3
// este mismo archivo es el que habla con la base, y cada método es una línea de
// MikroORM:
//
//   findAll     ->  orm.em.findAll(Producto, { orderBy: { id: 'asc' } })
//   findByNombre->  orm.em.findOne(Producto, { nombre })
//   findById    ->  orm.em.findOne(Producto, { id }, { populate: ['creadoPor'] })
//   guardar     ->  orm.em.create(Producto, {...}) + orm.em.flush()
//   eliminar    ->  orm.em.remove(producto) + orm.em.flush()
//
// El punto de la unidad es que ESO NO IMPORTA para testear el service. Sea un
// array, sea MySQL, sea una API de un tercero: el service ve el contrato de
// arriba y nada más.
//
// (Una diferencia a propósito con el 9.3: allá el repository usaba
// `findOneOrFail` y el "no existe" lo tiraba MikroORM. Acá `findById` devuelve
// `null` y la decisión de convertir eso en un 404 la toma el service. Es mejor
// así: la regla queda en la capa que se puede testear sin infraestructura.)
// ============================================================================

const productos: Producto[] = [
  { id: 1, nombre: 'Mate', precio: 5000, creadoPorId: 1 },
  { id: 2, nombre: 'Bombilla', precio: 2000, creadoPorId: 2 },
];

let proximoId = 3;

export const productosRepository: ProductosRepository = {
  async findAll() {
    return [...productos];
  },

  async findByNombre(nombre) {
    return productos.find((p) => p.nombre === nombre) ?? null;
  },

  async findById(id) {
    return productos.find((p) => p.id === id) ?? null;
  },

  async guardar(datos, creadoPorId) {
    const producto: Producto = { id: proximoId++, ...datos, creadoPorId };
    productos.push(producto);
    return producto;
  },

  async eliminar(producto) {
    const indice = productos.findIndex((p) => p.id === producto.id);
    if (indice !== -1) productos.splice(indice, 1);
  },
};
