// ============================================================================
// LA CONFIGURACIÓN - un solo archivo, y de acá sale todo lo demás
// ============================================================================

import { defineConfig } from '@mikro-orm/mysql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Producto } from './entities/producto.entity.js';

export default defineConfig({
  // Las entidades que el ORM tiene que descubrir. Se pueden listar a mano
  // (explícito, y el compilador avisa si borrás una) o con `entitiesTs` +
  // globs. Para proyectos de clase, la lista a mano es más clara.
  entities: [Producto],

  dbName: 'dsw_persistencia',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',

  // ── Por qué hace falta este metadataProvider ──
  // El ORM necesita saber que `nombre` es string y `precio` es number. Con
  // decoradores, esa información puede venir de dos lados:
  //   1. `emitDecoratorMetadata` de TypeScript — pero lo emite `tsc`, y en
  //      desarrollo nosotros corremos con tsx, que compila con esbuild y NO
  //      lo emite. Con esa vía, MikroORM tira:
  //      "Please provide either 'type' or 'entity' attribute in Producto.id".
  //   2. TsMorphMetadataProvider, que lee los archivos .ts y saca los tipos
  //      de ahí. Funciona con tsx, y permite escribir @Property() sin repetir
  //      el tipo en cada decorador.
  // Elegimos la segunda. Ver el README para el detalle de qué pasa al compilar
  // para producción.
  metadataProvider: TsMorphMetadataProvider,

  // Muestra por consola cada consulta SQL que ejecuta el ORM. En una clase de
  // persistencia esto no es opcional: la gracia es ver el SQL que se generó.
  debug: true,
});

// ── Sobre las credenciales en el código ──
// Sí, usuario y contraseña están acá adentro, a la vista y versionados. Está
// mal, y lo sabemos: es para que el ejemplo se pueda correr sin pasos previos.
// En la unidad 9 (autenticación) esto se muda a variables de entorno con un
// archivo .env, junto con el secret del JWT, que es donde el tema se vuelve
// imposible de ignorar.
