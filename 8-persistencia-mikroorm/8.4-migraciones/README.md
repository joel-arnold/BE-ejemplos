# 8.4 - Migraciones

> Clase "Persistencia: MikroORM + MySQL" · **Bloque 8**

Hasta acá el esquema se sincronizaba con `schema.update()`: el ORM compara el modelo con la base y aplica las diferencias. Es cómodo mientras se desarrolla y **no sirve para producción**.

```bash
npm install

npm run orm -- migration:list     # qué hay y qué se aplicó
npm run orm -- migration:up       # aplicar las pendientes
npm run estado                    # lo mismo, desde código

npm run orm -- migration:create   # generar una nueva a partir de los cambios
npm run orm -- migration:down     # volver atrás la última
```

Usa la base `dsw_migraciones`, separada de las otras dos.

## Por qué no alcanza `schema.update()`

| | `schema.update()` | Migraciones |
| --- | --- | --- |
| Deja registro de qué se aplicó | No | Sí, en `mikro_orm_migrations` |
| Se puede revisar antes de correr | No | Sí: es un archivo en el pull request |
| Se puede volver atrás | No | Sí, con el `down()` |
| Decide qué hacer con los datos existentes | No sabe | Lo decidís vos, en el archivo |
| Todos los ambientes quedan iguales | Por casualidad | Por construcción |

El caso concreto está en [Migration20260805093000.ts](src/migrations/Migration20260805093000.ts): se agregó `stock: number` a la entidad, y la tabla ya tenía filas en producción. Un `add stock int not null` a secas falla, porque MySQL no sabe qué stock ponerle a lo que ya existe. La migración lo resuelve con un `default 0`, que es una **decisión de negocio** — ninguna herramienta puede tomarla por vos.

Esa es la idea central de la unidad: el esquema deja de ser un estado que cada uno tiene distinto en su máquina y pasa a ser una **secuencia de cambios versionada** que todos aplican en el mismo orden.

## El flujo de trabajo

1. Se cambia la entidad (agregar una propiedad, cambiar un tipo).
2. `migration:create` compara el modelo contra la base y **escribe el archivo**.
3. **Se lee el archivo generado.** No es opcional: la CLI acierta el 90% de las veces, y el 10% restante es justo el que borra datos.
4. Se commitea junto con el cambio de la entidad, en el mismo commit.
5. `migration:up` en cada ambiente: en la máquina de cada uno, en el servidor de pruebas y en producción, en ese orden.

## La tabla de control

La primera vez que se corre `migration:up`, el ORM crea `mikro_orm_migrations`:

| name | executed_at |
| --- | --- |
| Migration20260801100000 | 2026-08-01 10:05:12 |
| Migration20260805093000 | 2026-08-05 09:41:03 |

Es el *hasta acá llegué* de cada base. Por eso una misma migración puede estar aplicada en tu máquina y pendiente en producción, y por eso `migration:up` es seguro de correr dos veces: la segunda no hace nada.

## Cuidado con MySQL y las transacciones

`transactional: true` hace que cada migración corra dentro de una transacción, pero **MySQL hace commit implícito en cada DDL** (`create table`, `alter table`). En la práctica: si una migración tiene tres `alter table` y el segundo falla, el primero **queda aplicado**.

Consecuencias prácticas:

- Conviene una migración por cambio conceptual, cortita, en vez de una gigante con quince pasos.
- Si una migración falla a la mitad, hay que mirar en qué estado quedó la base antes de reintentar.
- PostgreSQL sí soporta DDL transaccional; es una de las diferencias reales entre los dos motores.

## Del `.ts` al `.js` compilado

La config tiene los dos caminos:

```ts
migrations: {
  path: './dist/migrations',    // en producción corre lo compilado
  pathTs: './src/migrations',   // en desarrollo, los .ts
}
```

Las migraciones se escriben en `src/`, se versionan en git y se compilan con el resto del proyecto. **Nunca se editan después de aplicadas**: si algo salió mal, se crea una migración nueva que lo corrija. Editar una que ya corrió deja las bases de los demás en un estado que no coincide con el archivo.
