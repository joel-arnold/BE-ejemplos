// ============================================================================
// CRUD CON EL ENTITY MANAGER - las cuatro operaciones, sin escribir SQL
// ============================================================================
// Correr con: npm run crud   (antes correr `npm run conexion` una vez)
//
// El EntityManager (`em`) es el objeto con el que se trabaja siempre. Ojo con
// una cosa desde el arranque: NO hay un método save(). Los cambios se anotan y
// se mandan todos juntos con flush(). Eso se explica en 8.1.3.
// ============================================================================

import { MikroORM } from '@mikro-orm/mysql';
import config from './mikro-orm.config.js';
import { Producto } from './entities/producto.entity.js';

console.clear();

const orm = await MikroORM.init(config);
await orm.schema.refresh(); // arrancamos siempre de una base limpia

// Cada unidad de trabajo va en su propio fork del EntityManager. En una API eso
// lo resuelve un middleware (ejemplo 8.2); en un script, se pide a mano.
const em = orm.em.fork();

// ============================================================================
// NIVEL 1: CREATE - insertar
// ============================================================================

console.log('=== NIVEL 1: create + flush ===\n');

// em.create() construye la entidad y la deja MARCADA para insertar. Todavía no
// tocó la base: si el proceso muriera acá, no se guardó nada.
const teclado = em.create(Producto, { nombre: 'Teclado', precio: 25000 });
const mouse = em.create(Producto, { nombre: 'Mouse', precio: 15000 });

console.log('id antes del flush:', teclado.id); // undefined

// flush() es el que ejecuta. Manda los dos INSERT dentro de una transacción.
await em.flush();

console.log('id después del flush:', teclado.id); // 1
console.log('mouse:', mouse.id, mouse.nombre, '\n'); // 2 Mouse

// ============================================================================
// NIVEL 2: READ - buscar
// ============================================================================

console.log('=== NIVEL 2: findAll / findOne ===\n');

const todos = await em.findAll(Producto, { orderBy: { precio: 'desc' } });
console.log('todos:', todos.map((p) => `${p.nombre} $${p.precio}`));
// [ 'Teclado $25000', 'Mouse $15000' ]

// findOne devuelve la entidad o null. El objeto que sale de acá NO es un objeto
// plano: es una instancia de Producto, con sus métodos si los tuviera.
const uno = await em.findOne(Producto, { nombre: 'Mouse' });
console.log('findOne:', uno?.nombre, '| es Producto?', uno instanceof Producto);
// findOne: Mouse | es Producto? true

// Buscar por id es tan común que se puede pasar el id pelado.
const porId = await em.findOne(Producto, 1);
console.log('por id:', porId?.nombre, '\n'); // Teclado

// findOneOrFail lanza NotFoundError en vez de devolver null: cómodo cuando el
// errorHandler central ya lo traduce a un 404 (unidad 6).

// ============================================================================
// NIVEL 3: UPDATE - modificar
// ============================================================================

console.log('=== NIVEL 3: update ===\n');

const aActualizar = await em.findOneOrFail(Producto, { nombre: 'Teclado' });

// Acá está la idea más rara al principio y la más importante de todas: para
// actualizar se le asigna a la propiedad, como a cualquier objeto. No se llama
// a ningún método del ORM.
aActualizar.precio = 27000;

// em.assign() hace lo mismo para varios campos de una, y es lo que se usa desde
// un controller con el body ya validado.
em.assign(aActualizar, { descripcion: 'Mecánico, switches azules' });

// Recién en el flush el ORM compara el estado actual contra el que leyó de la
// base y genera el UPDATE con los campos que cambiaron. Ni uno más.
await em.flush();

const verificado = await em.findOneOrFail(Producto, 1);
console.log('actualizado:', verificado.precio, '|', verificado.descripcion, '\n');
// actualizado: 27000 | Mecánico, switches azules

// ============================================================================
// NIVEL 4: DELETE - borrar
// ============================================================================

console.log('=== NIVEL 4: remove ===\n');

const aBorrar = await em.findOneOrFail(Producto, { nombre: 'Mouse' });

// Mismo patrón que todo lo demás: remove() marca, flush() ejecuta.
em.remove(aBorrar);
await em.flush();

console.log('quedan:', (await em.findAll(Producto)).length, '\n'); // 1

await orm.close();

// ============================================================================
// RESUMEN
// ============================================================================
// create  -> marca para insertar      | flush ejecuta el INSERT
// find*   -> consulta ya mismo        | (no necesita flush)
// asignar -> marca para actualizar    | flush ejecuta el UPDATE
// remove  -> marca para borrar        | flush ejecuta el DELETE
//
// De las cuatro, la única que consulta en el momento es la lectura. Las otras
// tres anotan la intención y esperan al flush.
