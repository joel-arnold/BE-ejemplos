// ============================================================================
// POPULATE Y EL PROBLEMA N+1 - el costo escondido de las relaciones
// ============================================================================
// Correr con: npm run populate
//
// Este es el ejemplo que más rinde mirar la consola: la diferencia entre las
// dos versiones no está en el resultado (es idéntico) sino en la cantidad de
// consultas que salieron para conseguirlo.
//
// El N+1 es el error de performance más común con cualquier ORM, y es
// invisible hasta que la tabla crece: con 6 productos no se nota, con 6000 el
// endpoint tarda diez segundos.
// ============================================================================

import { MikroORM } from '@mikro-orm/mysql';
import { wrap } from '@mikro-orm/core';
import config from './mikro-orm.config.js';
import { sembrar } from './datosDePrueba.js';
import { Producto } from './entities/producto.entity.js';
import { Categoria } from './entities/categoria.entity.js';

console.clear();

const orm = await MikroORM.init(config);
await orm.schema.ensureDatabase();
await sembrar(orm);

// ============================================================================
// NIVEL 1: el problema
// ============================================================================

console.log('\n=== NIVEL 1: N+1 (contá los SELECT) ===\n');

const em1 = orm.em.fork();

// 1 consulta: traer las categorías.
const categorias = await em1.findAll(Categoria);

for (const categoria of categorias) {
  // N consultas: una por cada categoría del bucle.
  await categoria.productos.init();
  console.log(`${categoria.nombre}: ${categoria.productos.length} productos`);
}

console.log('\n^ 1 consulta de categorías + 1 por cada categoría = N+1 consultas.');
console.log('  Con 3 categorías son 4. Con 300, son 301.\n');

// ============================================================================
// NIVEL 2: la solución
// ============================================================================

console.log('=== NIVEL 2: populate ===\n');

const em2 = orm.em.fork();

// Mismo resultado, 2 consultas fijas: una de categorías y una sola de todos los
// productos de esas categorías (un WHERE categoria_id IN (...)).
const conProductos = await em2.findAll(Categoria, { populate: ['productos'] });

for (const categoria of conProductos) {
  console.log(`${categoria.nombre}: ${categoria.productos.length} productos`);
}

console.log('\n^ 2 consultas, y no cambian aunque haya 300 categorías.\n');

// ============================================================================
// NIVEL 3: populate en la otra dirección, y hasta dónde llega
// ============================================================================

console.log('=== NIVEL 3: populate desde el lado muchos ===\n');

const em3 = orm.em.fork();

// Sin populate, la relación ManyToOne viene como REFERENCIA: el objeto existe y
// tiene el id, pero el resto de las propiedades no están cargadas.
const sinPopulate = await em3.findAll(Producto);
console.log('id de la categoría sin populate:', sinPopulate[0]!.categoria.id); // el id sí está
console.log('¿está cargada?', wrap(sinPopulate[0]!.categoria).isInitialized()); // false

em3.clear();

// Con populate, se resuelve con un JOIN y las propiedades están todas.
const conPopulate = await em3.findAll(Producto, { populate: ['categoria'] });
console.log('nombre con populate:', conPopulate[0]!.categoria.nombre, '\n');

// Populate anidado: cargar la categoría de cada producto Y las etiquetas.
const anidado = await em3.findAll(Producto, { populate: ['categoria', 'etiquetas'] });
console.log(
  'anidado:',
  anidado.map((p) => `${p.nombre} (${p.categoria.nombre}) [${p.etiquetas.getItems().map((e) => e.nombre).join(', ')}]`),
);

// ============================================================================
// NIVEL 4: traer solo lo que se necesita
// ============================================================================

console.log('\n=== NIVEL 4: fields ===\n');

const em4 = orm.em.fork();

// populate trae las entidades completas. Si el endpoint solo muestra el nombre,
// `fields` limita las columnas del SELECT.
const soloNombres = await em4.findAll(Producto, {
  fields: ['nombre', 'categoria.nombre'],
});
console.log('solo dos columnas:', soloNombres.map((p) => `${p.nombre} / ${p.categoria.nombre}`));

await orm.close();

// ============================================================================
// RESUMEN
// ============================================================================
// El N+1 aparece cuando se navega una relación DENTRO de un bucle.
// La solución es pedir de entrada lo que se va a usar: populate.
// La regla práctica: si el endpoint devuelve la relación, populate; si no, no
// la cargues. Y con debug: true prendido, el N+1 se ve a simple vista.
