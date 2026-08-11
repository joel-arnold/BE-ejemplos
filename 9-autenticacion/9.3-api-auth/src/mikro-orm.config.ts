import { defineConfig } from '@mikro-orm/mysql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { env } from './config/env.js';
import { Usuario } from './entities/usuario.entity.js';
import { Producto } from './entities/producto.entity.js';

// Comparar con el mikro-orm.config.ts del 8.2: las cinco líneas de credenciales
// estaban escritas acá, con un comentario que remitía a esta unidad. Ahora
// vienen de `env`, que las leyó del .env y las validó al arrancar.
//
// El archivo dejó de tener secretos: se puede mostrar en clase, subir al repo
// y mandar por mail sin pensarlo.

export default defineConfig({
  entities: [Usuario, Producto],

  dbName: env.DB_NAME,
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,

  metadataProvider: TsMorphMetadataProvider,

  // Dejarlo en true durante la clase: se ve cada consulta que genera el ORM.
  debug: true,
});
