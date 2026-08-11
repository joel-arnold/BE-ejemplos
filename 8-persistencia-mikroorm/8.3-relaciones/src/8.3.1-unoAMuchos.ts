// ============================================================================
// UNO A MUCHOS - una categoría, muchos productos
// ============================================================================
// Correr con: npm run unoamuchos
//
// La relación se declara DOS veces, una de cada lado, y cada lado hace algo
// distinto:
//   Producto.categoria  -> @ManyToOne, lado DUEÑO: genera la columna categoria_id
//   Categoria.productos -> @OneToMany, lado INVERSO: no genera nada
// ============================================================================

import { MikroORM } from '@mikro-orm/mysql';
import config from './mikro-orm.config.js';
import { Producto } from './entities/producto.entity.js';
import { Categoria } from './entities/categoria.entity.js';

console.clear();

const orm = await MikroORM.init(config);
await orm.schema.ensureDatabase();

// ============================================================================
// NIVEL 1: qué tablas genera la relación
// ============================================================================

console.log('=== NIVEL 1: el esquema ===\n');
console.log(await orm.schema.getCreateSchemaSQL());

// Lo que hay que ver en esa salida:
//   - La tabla `categoria` no tiene ninguna columna de productos.
//   - La tabla `producto` tiene `categoria_id`, su índice y su foreign key.
// La relación existe una sola vez en la base, aunque se declare de los dos
// lados en el código.

await orm.schema.refresh();

// ============================================================================
// NIVEL 2: crear entidades relacionadas
// ============================================================================

console.log('=== NIVEL 2: crear ===\n');

const em = orm.em.fork();

const perifericos = em.create(Categoria, { nombre: 'Periféricos' });

// Se le asigna el OBJETO categoría, no el id. El ORM se encarga de escribir el
// número en la columna categoria_id, y de hacerlo DESPUÉS de insertar la
// categoría (que todavía no tiene id cuando se escribe esta línea).
em.create(Producto, { nombre: 'Teclado', precio: 25000, categoria: perifericos });
em.create(Producto, { nombre: 'Mouse', precio: 15000, categoria: perifericos });

console.log('id de la categoría antes del flush:', perifericos.id); // undefined

await em.flush();

console.log('después del flush:', perifericos.id, '\n'); // 1

// ============================================================================
// NIVEL 3: navegar la relación
// ============================================================================

console.log('=== NIVEL 3: navegar ===\n');

em.clear();

// Del lado "muchos": populate carga la categoría junto con el producto.
const producto = await em.findOneOrFail(Producto, { nombre: 'Teclado' }, { populate: ['categoria'] });
console.log('producto.categoria.nombre:', producto.categoria.nombre); // Periféricos

// Del lado "uno": la Collection arranca sin cargar y se inicializa a pedido.
const categoria = await em.findOneOrFail(Categoria, { nombre: 'Periféricos' });
console.log('¿la colección está cargada?', categoria.productos.isInitialized()); // false

await categoria.productos.init(); // ← acá recién sale el SELECT de productos

console.log('¿y ahora?', categoria.productos.isInitialized()); // true
console.log('productos:', categoria.productos.getItems().map((p) => p.nombre));
// [ 'Teclado', 'Mouse' ]

// La Collection es iterable como un array, pero SOLO después de inicializarla.
// Recorrerla sin cargar devuelve vacío, y ese es un bug clásico: la lista sale
// vacía en la respuesta JSON y la base tiene los datos.

await orm.close();

// ============================================================================
// RESUMEN
// ============================================================================
// @ManyToOne  -> lado dueño, genera la columna FK. La FK va del lado "muchos".
// @OneToMany  -> lado inverso, no genera nada. Necesita saber quién es el dueño.
// Se asignan OBJETOS, no ids.
// Las colecciones no vienen cargadas: hay que pedirlas (populate o init).
