import { MikroORM } from '@mikro-orm/mysql';
import config from './mikro-orm.config.js';

// Idéntico al db.ts del 8.2.
export const orm = await MikroORM.init(config);

await orm.schema.ensureDatabase();
await orm.schema.update();

console.log('Conectado a MySQL, esquema sincronizado');
