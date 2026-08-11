import { defineConfig } from '@mikro-orm/mysql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Producto } from './entities/producto.entity.js';

export default defineConfig({
  entities: [Producto],

  dbName: 'dsw_persistencia',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',

  // tsx compila con esbuild y esbuild no emite `emitDecoratorMetadata`, así que
  // los tipos de las propiedades los saca ts-morph leyendo los .ts.
  // Detalle completo en el README de 8.1.
  metadataProvider: TsMorphMetadataProvider,

  // Dejarlo en true durante la clase: se ve cada consulta que genera el ORM.
  // En un proyecto de verdad, esto se prende solo en desarrollo.
  debug: true,
});

// Las credenciales van a un .env en la unidad 9, junto con el secret del JWT.
