# 8.1 - Primer contacto con MikroORM

> Clase "Persistencia: MikroORM + MySQL" · **Bloques 3, 4 y 5**

Tres archivos, sin servidor y sin Express, para ver el ORM solo: cómo una clase de TypeScript se convierte en una tabla, cómo se hacen las cuatro operaciones y por qué no existe `save()`.

## Antes de correr

Hace falta un MySQL andando. La base **no** hay que crearla a mano: `ensureDatabase()` la crea si no existe. Lo único que puede hacer falta es corregir el usuario y la contraseña en [src/mikro-orm.config.ts](src/mikro-orm.config.ts).

```bash
npm install
npm run conexion   # 8.1.1 - conecta, muestra el DDL y crea las tablas
npm run crud       # 8.1.2 - insertar, buscar, modificar, borrar
npm run uow        # 8.1.3 - unit of work e identity map
```

Los tres corren con `debug: true`: **el SQL que genera el ORM sale por consola**. Es la mitad del ejemplo — conviene leerlo, no saltearlo.

## Recorrido

| Archivo | Qué muestra |
| --- | --- |
| [8.1.1-conexionYEsquema.ts](src/8.1.1-conexionYEsquema.ts) | `MikroORM.init()`, y el `create table` que sale de la clase `Producto`. |
| [8.1.2-crud.ts](src/8.1.2-crud.ts) | `create`, `findAll`/`findOne`, modificar por asignación, `remove`. Siempre cerrando con `flush()`. |
| [8.1.3-unitOfWorkEIdentityMap.ts](src/8.1.3-unitOfWorkEIdentityMap.ts) | Los dos patrones que explican todo lo anterior, y por qué cada unidad de trabajo necesita su `fork()`. |

## Las tres ideas

**1. La entidad es una clase común.** No hereda de nada del ORM. Los decoradores solo agregan información sobre cómo mapear cada propiedad. Es la clase de la unidad 7 con anotaciones.

**2. No hay `save()`.** Se modifica el objeto como cualquier objeto de JavaScript y, al final, un `flush()` manda todos los cambios juntos en una transacción. El ORM compara contra lo que leyó y genera solo los `UPDATE` de los campos que cambiaron.

```ts
const producto = await em.findOneOrFail(Producto, 1);
producto.precio = 27000;   // esto es todo el "update"
await em.flush();          // acá recién viaja el SQL
```

**3. Una fila es un objeto.** Dentro de un mismo EntityManager, buscar dos veces el producto 1 devuelve **la misma instancia**, y la segunda búsqueda no genera consulta. Por eso cada unidad de trabajo necesita su propio `fork()`: en una API, un fork por request.

## El detalle del `metadataProvider`

El ORM necesita saber que `nombre` es `string`. Con decoradores hay dos formas de averiguarlo:

- **`emitDecoratorMetadata`** de TypeScript — pero lo emite `tsc`, y en desarrollo corremos con **tsx**, que compila con esbuild y no lo emite. Por ese camino el ORM falla con `Please provide either 'type' or 'entity' attribute in Producto.id`.
- **`TsMorphMetadataProvider`** (`@mikro-orm/reflection`), que lee los `.ts` y saca los tipos de ahí. Funciona con tsx y permite escribir `@Property()` sin repetir el tipo.

Usamos la segunda. La alternativa sin paquetes extra es declarar el tipo en cada decorador (`@Property({ type: 'string' })`), que también funciona pero se repite.

> **Al compilar para producción**, los `.ts` ya no están al lado del código que corre, así que hay que generar la caché de metadata durante el build (`mikro-orm cache:generate --combined`) o pasar a tipos explícitos. En estos ejemplos corremos siempre en desarrollo; el tema vuelve en la unidad de deploy.

## Un poco más lejos

- `findOneOrFail` lanza `NotFoundError` en lugar de devolver `null`: encaja directo con el `errorHandler` centralizado de la unidad 6 traduciéndolo a un 404.
- `em.count()` cuenta sin traer las filas; `em.findAndCount()` devuelve página y total de una, que es lo que necesita cualquier listado paginado.
- `precio` quedó como `int` porque nadie eligió otra cosa. Para plata conviene `@Property({ columnType: 'decimal(10,2)' })`: el ORM elige por vos cuando no elegís vos.
