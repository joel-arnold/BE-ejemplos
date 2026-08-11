# 8 - Persistencia: MikroORM + MySQL

Ejemplos que acompañan la clase **"Persistencia: MikroORM + MySQL"**. Siguen el mismo caso mínimo de las unidades 6 y 7 (`productos` con `nombre` y `precio`), ahora contra una base de datos de verdad.

El hilo de las tres unidades, en una línea por unidad:

- **6** separó la API en capas y prometió que cambiar la persistencia iba a tocar un solo archivo.
- **7** escribió esa promesa como tipos, verificables por el compilador.
- **8** la cobra: el repository pasa de un array a MySQL y **el service no se toca**.

## Recorrido

| Ejemplo | Bloque de la clase | Qué muestra |
| --- | --- | --- |
| [8.1-primer-contacto](8.1-primer-contacto/) | Bloques 3, 4 y 5 | Conexión, entidad, esquema, CRUD y los dos patrones que explican todo: unit of work e identity map. |
| [8.2-api-mikroorm](8.2-api-mikroorm/) | Bloque 6 | El ejemplo `7.3` con el repository sobre MySQL. `RequestContext`, y el service intacto. |
| [8.3-relaciones](8.3-relaciones/) | Bloque 7 | Uno a muchos, muchos a muchos, `populate` y el problema N+1. |
| [8.4-migraciones](8.4-migraciones/) | Bloque 8 | El esquema como código versionado, en vez de `schema.update()`. |

El **8.2 está pensado para abrirse al lado del [7.3](../7-typescript/7.3-validacion-zod/)**: la mayoría de los archivos son idénticos y la diferencia se ve de un vistazo. La prueba que resume la unidad es crear un producto, **reiniciar el servidor** y volver a listar.

## Antes de correr cualquiera

Hace falta un **MySQL** andando en `localhost:3306`. Las bases **no** hay que crearlas a mano (`ensureDatabase()` se encarga), pero sí puede hacer falta corregir usuario y contraseña en el `mikro-orm.config.ts` de cada carpeta, que asumen `root`/`root`.

Cada ejemplo usa su propia base para no pisarse:

| Ejemplo | Base |
| --- | --- |
| 8.1 y 8.2 | `dsw_persistencia` |
| 8.3 | `dsw_relaciones` |
| 8.4 | `dsw_migraciones` |

```bash
cd 8-persistencia-mikroorm/8.2-api-mikroorm   # o el que quieras
npm install
npm run dev
```

Los ejemplos sin servidor (8.1, 8.3, 8.4) tienen un script por archivo: `npm run crud`, `npm run populate`, etc. Están todos con **`debug: true`**: el SQL que genera el ORM sale por consola, y leerlo es la mitad del ejercicio.

## Versiones y decisiones de configuración

**MikroORM 7.1.11** con **decoradores**. Dos detalles que no son obvios y que valen para cualquier proyecto nuevo:

1. **Los decoradores no están en `@mikro-orm/core`.** Desde la v7 viven en un paquete aparte:

   ```ts
   import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/es';
   ```

   El subpath `/es` son los decoradores **estándar del lenguaje** (los que TypeScript 5 usa por defecto, sin `experimentalDecorators`). El otro subpath, `/legacy`, son los experimentales de siempre. Casi todo el material que se encuentra buscando está escrito para v6, donde los decoradores se importaban de `@mikro-orm/core`: si un ejemplo de internet no compila, esto es lo primero para mirar.

2. **`TsMorphMetadataProvider` no es opcional acá.** El ORM necesita saber que `nombre` es `string`. La vía habitual es `emitDecoratorMetadata`, pero lo emite `tsc` y en desarrollo corremos con **tsx**, que compila con esbuild y no lo emite. Sin el metadata provider, el ORM falla con `Please provide either 'type' or 'entity' attribute in Producto.id`. La alternativa sería repetir el tipo en cada decorador (`@Property({ type: 'string' })`).

Otros cambios de la v7 respecto de lo que se encuentra escrito para v6:

| v6 | v7 |
| --- | --- |
| `orm.schema.createSchema()` / `updateSchema()` | `orm.schema.create()` / `update()` |
| `orm.getMigrator()` | `orm.migrator` |
| `migrator.getExecutedMigrations()` | `migrator.getExecuted()` |

El resto del stack lo hereda de la unidad 7: **ESM** con `"module": "NodeNext"` (imports relativos con extensión `.js`), **tsx** en desarrollo, `tsc` solo para el build, TypeScript 5.4.5 y Zod 3.23.8.

## Qué se guarda y qué no

Las credenciales están a la vista en cada `mikro-orm.config.ts`, y está mal a propósito: es para que el ejemplo corra sin pasos previos. En la **unidad 9** se mudan a variables de entorno con un `.env`, junto con el secret del JWT.
