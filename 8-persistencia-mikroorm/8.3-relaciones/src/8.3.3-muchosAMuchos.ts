// ============================================================================
// MUCHOS A MUCHOS - un producto tiene varias etiquetas, una etiqueta está en
// varios productos
// ============================================================================
// Correr con: npm run muchosamuchos
//
// En SQL esto no se puede hacer con una columna: hace falta una TERCERA tabla
// que junte los dos ids. Lo interesante del ORM acá es que esa tabla existe en
// la base pero no en el código: no hay ninguna clase que la represente.
// ============================================================================

import { MikroORM } from '@mikro-orm/mysql';
import config from './mikro-orm.config.js';
import { sembrar } from './datosDePrueba.js';
import { Producto } from './entities/producto.entity.js';
import { Etiqueta } from './entities/etiqueta.entity.js';

console.clear();

const orm = await MikroORM.init(config);
await orm.schema.ensureDatabase();
await sembrar(orm);

// ============================================================================
// NIVEL 1: la tabla que nadie escribió
// ============================================================================

console.log('\n=== NIVEL 1: la tabla intermedia ===\n');

const ddl = await orm.schema.getCreateSchemaSQL();
console.log(ddl.split('\n').filter((l) => l.includes('etiquetas')).join('\n'));

// Sale algo así:
//   create table `producto_etiquetas` (
//     `producto_id` int unsigned not null,
//     `etiqueta_id` int unsigned not null,
//     primary key (`producto_id`, `etiqueta_id`)
//   ) ...
//
// Clave primaria compuesta por los dos ids: la misma combinación no se puede
// repetir. Esa tabla la generó el decorador @ManyToMany({ owner: true }).

// ============================================================================
// NIVEL 2: agregar y sacar
// ============================================================================

console.log('\n=== NIVEL 2: add / remove ===\n');

const em = orm.em.fork();

const teclado = await em.findOneOrFail(Producto, { nombre: 'Teclado' }, { populate: ['etiquetas'] });
const oferta = await em.findOneOrFail(Etiqueta, { nombre: 'oferta' });

console.log('antes:', teclado.etiquetas.getItems().map((e) => e.nombre)); // [ 'gamer' ]

// add() y remove() sobre la Collection. Como todo lo demás, solo marcan: la
// fila en la tabla intermedia se inserta en el flush.
teclado.etiquetas.add(oferta);
await em.flush();

console.log('después:', teclado.etiquetas.getItems().map((e) => e.nombre)); // [ 'gamer', 'oferta' ]

teclado.etiquetas.remove(oferta);
await em.flush();

console.log('y de vuelta:', teclado.etiquetas.getItems().map((e) => e.nombre), '\n'); // [ 'gamer' ]

// ============================================================================
// NIVEL 3: consultar por el otro lado
// ============================================================================

console.log('=== NIVEL 3: filtrar por la relación ===\n');

const em2 = orm.em.fork();

// Filtrar productos por una propiedad de su relación: el ORM arma el JOIN.
const gamers = await em2.find(Producto, { etiquetas: { nombre: 'gamer' } });
console.log('productos gamer:', gamers.map((p) => p.nombre)); // [ 'Teclado', 'Mouse' ]

// Y al revés, desde la etiqueta.
const inalambrico = await em2.findOneOrFail(Etiqueta, { nombre: 'inalámbrico' }, { populate: ['productos'] });
console.log('productos inalámbricos:', inalambrico.productos.getItems().map((p) => p.nombre));
// Mouse y Parlantes (sin orderBy, el orden lo decide la base)

await orm.close();

// ============================================================================
// RESUMEN
// ============================================================================
// @ManyToMany necesita un lado dueño ({ owner: true }): ese declara la tabla
// intermedia, que el ORM crea y mantiene sin que haya una clase para ella.
// add() y remove() marcan; el flush escribe.
// Se puede filtrar por propiedades de la relación y el ORM arma el JOIN.
//
// Cuándo NO alcanza: si la relación necesita datos propios (la cantidad en un
// pedido, la fecha en que se asignó la etiqueta), la tabla intermedia deja de
// ser intermedia y pasa a ser una entidad más, con sus dos @ManyToOne.
