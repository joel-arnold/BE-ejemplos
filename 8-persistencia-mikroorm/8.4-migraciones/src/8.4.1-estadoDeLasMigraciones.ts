// ============================================================================
// EL ESTADO DE LAS MIGRACIONES - qué se aplicó y qué falta
// ============================================================================
// Correr con: npm run estado
//
// Lo mismo que hace `npm run orm -- migration:list`, pero desde código, para
// ver que el Migrator es una API normal y no solo una herramienta de terminal.
// ============================================================================

import { MikroORM } from '@mikro-orm/mysql';
import config from './mikro-orm.config.js';

console.clear();

const orm = await MikroORM.init(config);
await orm.schema.ensureDatabase();

const migrator = orm.migrator;

// Las que ya corrieron: salen de la tabla `mikro_orm_migrations` de ESTA base.
// La misma migración puede estar aplicada acá y pendiente en producción.
const aplicadas = await migrator.getExecuted();

// Las que están en src/migrations/ y todavía no se aplicaron en esta base.
const pendientes = await migrator.getPending();

console.log('\n=== Aplicadas ===');
if (aplicadas.length === 0) {
  console.log('(ninguna todavía: corré `npm run orm -- migration:up`)');
}
for (const m of aplicadas) {
  console.log(`  ${m.name}  ${m.executed_at?.toISOString() ?? ''}`);
}

console.log('\n=== Pendientes ===');
if (pendientes.length === 0) {
  console.log('(ninguna: la base está al día con el código)');
}
for (const m of pendientes) {
  console.log(`  ${m.name}`);
}

console.log();

await orm.close();

// ============================================================================
// La diferencia con schema.update() en una línea:
// update() te deja la base como el modelo, pero no sabe QUÉ pasó ni en qué
// orden, no se puede revisar en un pull request y no se puede volver atrás.
// ============================================================================
