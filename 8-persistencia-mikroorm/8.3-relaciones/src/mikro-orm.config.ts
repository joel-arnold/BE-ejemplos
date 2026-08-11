import { defineConfig } from '@mikro-orm/mysql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Producto } from './entities/producto.entity.js';
import { Categoria } from './entities/categoria.entity.js';
import { Etiqueta } from './entities/etiqueta.entity.js';

export default defineConfig({
  entities: [Producto, Categoria, Etiqueta],

  dbName: 'dsw_relaciones',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',

  metadataProvider: TsMorphMetadataProvider,

  // Imprescindible en este ejemplo: todo el punto del N+1 es CONTAR consultas.
  debug: true,
});
