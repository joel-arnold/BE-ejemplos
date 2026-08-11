// ============================================================================
// UNIT OF WORK E IDENTITY MAP - por qué no hay save()
// ============================================================================
// Correr con: npm run uow
//
// Estos dos patrones son LA diferencia entre MikroORM y escribir consultas a
// mano. Explican por qué el código de 8.1.2 se ve raro la primera vez, y por
// qué después se vuelve difícil volver atrás.
//
// Correr este archivo mirando el SQL de la consola (debug: true): la mitad de
// lo interesante está en las consultas que NO aparecen.
// ============================================================================

import { MikroORM } from '@mikro-orm/mysql';
import config from './mikro-orm.config.js';
import { Producto } from './entities/producto.entity.js';

console.clear();

const orm = await MikroORM.init(config);
await orm.schema.refresh();

const em = orm.em.fork();
em.create(Producto, { nombre: 'Teclado', precio: 25000 });
em.create(Producto, { nombre: 'Mouse', precio: 15000 });
em.create(Producto, { nombre: 'Monitor', precio: 180000 });
await em.flush();
em.clear(); // vaciamos el identity map para arrancar el ejemplo desde cero

// ============================================================================
// NIVEL 1: IDENTITY MAP - una fila, un objeto
// ============================================================================

console.log('=== NIVEL 1: identity map ===\n');

const a = await em.findOne(Producto, 1); // ← genera un SELECT
const b = await em.findOne(Producto, 1); // ← NO genera nada: ya lo tiene

console.log('¿son el mismo objeto?', a === b); // true

// Esto no es una optimización menor: es una garantía de consistencia. Dentro de
// una misma unidad de trabajo, la fila 1 es UN objeto. Si dos partes del código
// buscan el producto 1 y una lo modifica, la otra ve el cambio, porque son la
// misma instancia. Sin identity map, serían dos copias que se pisan al guardar.

a!.precio = 99999;
console.log('b.precio también cambió:', b!.precio, '\n'); // 99999

em.clear(); // descartamos ese cambio, no lo vamos a guardar

// ============================================================================
// NIVEL 2: UNIT OF WORK - anotar todo y mandarlo junto
// ============================================================================

console.log('=== NIVEL 2: unit of work ===\n');

const productos = await em.findAll(Producto);

// Tres cambios de tres tipos distintos, sin una sola llamada al ORM:
productos[0]!.precio = 26000; // UPDATE
em.create(Producto, { nombre: 'Webcam', precio: 45000 }); // INSERT
em.remove(productos[2]!); // DELETE

console.log('Hasta acá no se ejecutó ninguna consulta de escritura.');
console.log('Mirá el SQL que sale del flush:\n');

// Un solo flush: el ORM calcula los cambios, los ordena (los INSERT antes que
// los DELETE que dependan de ellos, por ejemplo) y los manda en UNA transacción.
// O entran los tres, o no entra ninguno.
await em.flush();

console.log('\nresultado:', (await em.findAll(Producto)).map((p) => p.nombre));
// [ 'Teclado', 'Mouse', 'Webcam' ]

// ============================================================================
// NIVEL 3: por qué em.fork() y no orm.em directo
// ============================================================================

console.log('\n=== NIVEL 3: fork ===\n');

// El identity map es una ventaja mientras dure poco. Si un único EntityManager
// viviera todo lo que vive el servidor, se iría llenando de entidades viejas:
// una fuga de memoria y, peor, datos desactualizados servidos como frescos.
//
// Por eso cada unidad de trabajo usa su propio fork, con su propio identity map.

const otro = orm.em.fork();
const mismoProducto = await otro.findOne(Producto, 1);
const desdeElPrimero = await em.findOne(Producto, 1);

console.log('¿mismo objeto entre forks?', mismoProducto === desdeElPrimero); // false
console.log('(cada fork tiene su propio identity map)\n');

// En una API HTTP, "una unidad de trabajo" = "un request". Eso es exactamente
// lo que hace el middleware RequestContext del ejemplo 8.2: un fork por request,
// automático.

await orm.close();

// ============================================================================
// RESUMEN
// ============================================================================
// Identity map -> dentro de un EntityManager, una fila es un solo objeto.
// Unit of work -> los cambios se acumulan y salen juntos en una transacción.
// flush()      -> el único momento en que se escribe en la base.
// fork()       -> una unidad de trabajo nueva, con su identity map vacío.
//
// La consecuencia práctica: no busques save(). Modificá el objeto y hacé flush.
