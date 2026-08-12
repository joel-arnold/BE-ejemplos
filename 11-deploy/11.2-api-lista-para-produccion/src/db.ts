import { MikroORM } from '@mikro-orm/mysql';
import config from './mikro-orm.config.js';
import { esProduccion } from './config/env.js';

// ============================================================================
// LA CONEXIÓN, Y EL ESQUEMA QUE YA NO SE SINCRONIZA SOLO
// ============================================================================
// El db.ts de las unidades 8 y 9 decía:
//
//     await orm.schema.ensureDatabase();
//     await orm.schema.update();
//
// Eso es comodísimo mientras la base es tuya y está vacía: cambiás una entidad
// y el esquema se acomoda solo. Y es inaceptable contra una base con datos.
//
// `schema.update()` compara tus entidades con la base y genera el SQL para que
// se parezcan. Cuando la diferencia es "sobra una columna", el SQL que genera
// es un DROP COLUMN. No pregunta, no avisa y no hay Ctrl+Z: los datos de esa
// columna dejaron de existir. Renombrar un campo en una entidad —una operación
// de dos segundos— borra la columna vieja con todo lo que tenía adentro.
//
// La versión de la unidad 8.4 es la que sirve acá: cada cambio de esquema es
// un archivo de migración versionado, revisable en un pull request, y la tabla
// mikro_orm_migrations lleva la cuenta de cuáles se aplicaron en cada base.
// ============================================================================

export const orm = await MikroORM.init(config);

if (esProduccion) {
  // Correr las migraciones pendientes al arrancar. `up()` mira la tabla
  // mikro_orm_migrations, aplica solo las que faltan y no hace nada si está
  // todo al día — así que arrancar diez veces seguidas es inofensivo.
  //
  // Lo prolijo es que esto sea un paso aparte del arranque (un "pre-deploy
  // command"), para que una migración fallida no deje la aplicación en un
  // bucle de reinicios. En los planes gratis ese paso no existe, y hacerlo acá
  // es la opción razonable: vale saber que es un atajo y por qué.
  const migrator = orm.migrator;
  const pendientes = await migrator.getPending();

  if (pendientes.length > 0) {
    console.log(`Aplicando ${pendientes.length} migración/es pendiente/s...`);
    await migrator.up();
  }

  console.log('Base al día');
} else {
  // En desarrollo sigue siendo cómodo que la base se cree sola la primera vez.
  // Lo que NO vuelve es el schema.update(): el esquema se cambia con
  // `npm run orm -- migration:create` también acá, para que lo que probaste en
  // tu máquina sea exactamente lo que va a correr en el servidor.
  await orm.schema.ensureDatabase();
  await orm.migrator.up();
  console.log('Conectado a MySQL local, migraciones aplicadas');
}
