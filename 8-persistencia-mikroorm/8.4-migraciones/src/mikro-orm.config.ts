import { defineConfig } from '@mikro-orm/mysql';
import { Migrator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Producto } from './entities/producto.entity.js';

export default defineConfig({
  entities: [Producto],

  dbName: 'dsw_migraciones',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',

  metadataProvider: TsMorphMetadataProvider,

  // El Migrator es una extensión: hay que declararla para que la CLI tenga los
  // comandos migration:*.
  extensions: [Migrator],

  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',

    // Con true, cada migración corre adentro de una transacción: si falla a la
    // mitad, no queda el esquema a medio aplicar. En MySQL hay una limitación
    // importante — ver el README.
    transactional: true,

    // Deja registro en la tabla `mikro_orm_migrations` de cada migración
    // aplicada y cuándo. Esa tabla es el "hasta acá llegué" de cada base.
    tableName: 'mikro_orm_migrations',
  },

  debug: true,
});

// La CLI encuentra este archivo por la sección "mikro-orm" del package.json:
//   "mikro-orm": { "configPaths": ["./src/mikro-orm.config.ts"] }
