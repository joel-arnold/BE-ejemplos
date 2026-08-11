import { MikroORM } from '@mikro-orm/mysql';
import config from './mikro-orm.config.js';

// El ORM se inicializa UNA vez por proceso, no una vez por request: adentro
// tiene un pool de conexiones que se reparte entre todos los requests.
export const orm = await MikroORM.init(config);

// Crea la base si no existe, para que el ejemplo arranque sin pasos previos.
await orm.schema.ensureDatabase();

// update() compara el modelo con la base y aplica las diferencias. Es cómodo
// en desarrollo y NO se usa en producción: no sabe conservar datos cuando el
// cambio es ambiguo, y no deja registro de qué se aplicó. Para eso están las
// migraciones — ejemplo 8.4.
await orm.schema.update();

console.log('Conectado a MySQL, esquema sincronizado');
