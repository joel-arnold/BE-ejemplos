# 8.2 - La API en capas, sobre MySQL

> Clase "Persistencia: MikroORM + MySQL" · **Bloque 6**

El ejemplo [7.3](../../7-typescript/7.3-validacion-zod/) con el array reemplazado por una base de datos de verdad. Está pensado para abrirse **lado a lado con el 7.3**: la mayoría de los archivos son idénticos.

## Qué cambió respecto de 7.3

| Archivo | Cambio |
| --- | --- |
| `entities/producto.entity.ts` | **Nuevo.** La clase con decoradores. Reemplaza al tipo `Producto` que antes salía de `z.infer`. |
| `mikro-orm.config.ts` | **Nuevo.** Conexión, entidades y `metadataProvider`. |
| `db.ts` | **Nuevo.** Inicializa el ORM una vez por proceso y exporta `orm`. |
| `repositories/` | Array → `EntityManager`. **Todo el cambio de la unidad vive acá.** |
| `app.ts` | Suma el middleware `RequestContext`: un fork del EM por request. |
| `shared/errorHandler.ts` | Suma `NotFoundError` (404) y `UniqueConstraintViolationException` (409). |
| `schemas/producto.schema.ts` | Ya no define `Producto` (eso lo hace la entidad). Le queda validar el body. |
| `services/` | **Una línea**: de dónde importa el tipo `Producto`. El cuerpo es idéntico. |
| `controllers/`, `routes/`, `shared/validar.ts` | Sin cambios. |

## El punto de la clase

El service quedó así:

```ts
export async function crearProducto(datos: ProductoNuevo): Promise<Producto> {
  const existente = await repo.findByNombre(datos.nombre);

  if (existente) {
    throw new ValidationError(`Ya existe un producto llamado "${datos.nombre}"`);
  }

  return repo.guardar(datos);
}
```

Es **el mismo cuerpo** que en 7.3, cuando abajo había un array. Abajo ahora hay MySQL y el service no se enteró. Eso es lo que se compró al separar en capas en la unidad 6 y al escribir el contrato como tipos en la 7: la deuda se cobra en esta clase.

## Probarlo

```bash
npm install
npm run dev
```

Hace falta un MySQL andando; la base la crea `ensureDatabase()`. Si el usuario o la contraseña no son `root`/`root`, corregirlos en [src/mikro-orm.config.ts](src/mikro-orm.config.ts).

La prueba que resume la unidad está en [productos.http](productos.http): crear un producto, **parar el servidor, volver a levantarlo** y listar. Contra 7.3 la lista vuelve al array inicial; acá el producto sigue estando.

## `RequestContext`: el middleware que no se puede olvidar

```ts
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});
```

Crea un fork del EntityManager por request. Sin esto, todos los requests comparten un identity map que nunca se vacía: fuga de memoria, entidades de un usuario visibles en el request de otro y, con concurrencia, el error `Using global EntityManager instance methods for context specific actions is disallowed`.

Es el `em.fork()` del ejemplo [8.1.3](../8.1-primer-contacto/src/8.1.3-unitOfWorkEIdentityMap.ts) llevado a HTTP: **un request es una unidad de trabajo**.

## Zod no sobra

La pregunta aparece sola: si la entidad ya dice que `precio` es `number`, ¿para qué el esquema?

- La **entidad** describe cómo se *guarda* el producto: columna, tipo SQL, largo, índices. Actúa cuando el dato ya entró.
- **Zod** describe qué se *acepta* en el body. Actúa en el borde, antes de que entre.

Sin Zod, `{"precio": "60000"}` llegaría hasta el driver y el error sería un **500** en vez de un **400** que dice qué campo está mal. La cadena completa quedó así:

| Control | Dónde | Qué garantiza |
| --- | --- | --- |
| Zod | Middleware, antes del controller | Formato de lo que entra |
| Service | Capa de negocio | Reglas que dependen del estado (nombre repetido) |
| Entidad + MySQL | La base | Que el dato guardado sea válido, pase lo que pase |

Los tres hacen falta y ninguno reemplaza a los otros. El `unique` de la columna `nombre` atrapa incluso el caso que el service no puede: dos requests simultáneos con el mismo nombre pasan los dos el `SELECT` y uno de los dos `INSERT` tiene que fallar. Ese es el 409 del `errorHandler`.

## Un poco más lejos

- `orm.em` es un proxy: devuelve el EntityManager del request en curso. Por eso el repository puede usarlo sin recibirlo por parámetro.
- El `await orm.schema.update()` de `db.ts` es cómodo en desarrollo y no va a producción: no deja registro de qué se aplicó ni sabe conservar datos cuando el cambio es ambiguo. Eso se resuelve en [8.4](../8.4-migraciones/).
- `em.findAll(Producto)` sin filtro trae la tabla entera. En un listado real va con paginación: `em.findAndCount(Producto, {}, { limit, offset })`.
