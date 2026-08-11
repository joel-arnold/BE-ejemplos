# 8.3 - Relaciones entre entidades

> Clase "Persistencia: MikroORM + MySQL" · **Bloque 7**

El modelo crece: los productos pasan a tener una **categoría** (uno a muchos) y varias **etiquetas** (muchos a muchos).

```bash
npm install
npm run unoamuchos      # 8.3.1 - la FK, los dos lados de la relación, navegarla
npm run populate        # 8.3.2 - populate y el problema N+1
npm run muchosamuchos   # 8.3.3 - la tabla intermedia que nadie escribe
```

Usa la base `dsw_relaciones`, separada de la del 8.2, y la crea sola. Los tres corren con `debug: true`: en este ejemplo **contar las consultas es el ejercicio**.

## Los dos lados de una relación

Una relación se declara dos veces y cada lado hace algo distinto:

| | Decorador | Genera | Regla |
| --- | --- | --- | --- |
| **Dueño** | `@ManyToOne` en `Producto.categoria` | la columna `categoria_id`, su FK y su índice | en un uno a muchos, la FK va siempre del lado *muchos* |
| **Inverso** | `@OneToMany` en `Categoria.productos` | nada | necesita decir cuál propiedad del otro lado es la dueña |

En la base la relación existe **una sola vez**, aunque en el código aparezca de los dos lados.

Y se asignan **objetos, no ids**:

```ts
const perifericos = em.create(Categoria, { nombre: 'Periféricos' });
em.create(Producto, { nombre: 'Teclado', precio: 25000, categoria: perifericos });
await em.flush();  // el ORM inserta la categoría primero y recién ahí el producto
```

## Las colecciones no vienen cargadas

`Collection` no es un array: es un array que sabe si está cargado. Por defecto **no lo está**, para que pedir una categoría no arrastre todos sus productos sin que nadie lo pida.

```ts
const categoria = await em.findOneOrFail(Categoria, 1);
categoria.productos.isInitialized();      // false
categoria.productos.getItems();            // vacío (¡y no es que no haya!)

await categoria.productos.init();           // ahora sí sale el SELECT
```

Recorrer una colección sin inicializar devuelve vacío sin avisar. Es el bug clásico de la unidad: la lista sale vacía en el JSON y los datos están en la base.

## El problema N+1

Es el error de performance más común con cualquier ORM, y es invisible hasta que la tabla crece:

```ts
const categorias = await em.findAll(Categoria);   // 1 consulta
for (const c of categorias) {
  await c.productos.init();                       // + 1 por cada categoría
}
```

Con 3 categorías son 4 consultas y no se nota. Con 300, son 301 y el endpoint tarda diez segundos. La solución es pedir de entrada lo que se va a usar:

```ts
const categorias = await em.findAll(Categoria, { populate: ['productos'] });
// 2 consultas fijas, no importa cuántas categorías haya
```

**La regla práctica:** si el endpoint devuelve la relación, `populate`; si no, no la cargues. Y con `debug: true` prendido, el N+1 se ve a simple vista mientras se desarrolla.

Cuando ni siquiera hacen falta las entidades completas, `fields` limita las columnas:

```ts
await em.findAll(Producto, { fields: ['nombre', 'categoria.nombre'] });
```

## Muchos a muchos

`@ManyToMany` con `{ owner: true }` de un lado y `mappedBy` del otro. El ORM crea y mantiene la tabla intermedia `producto_etiquetas(producto_id, etiqueta_id)` con clave primaria compuesta — **y no hay ninguna clase que la represente**.

Eso alcanza mientras la relación no tenga datos propios. Si hace falta guardar la cantidad de un producto en un pedido, o cuándo se asignó la etiqueta, la tabla intermedia deja de ser intermedia: pasa a ser una entidad más, con sus dos `@ManyToOne`.

## Un poco más lejos

- Se puede filtrar por propiedades de la relación y el ORM arma el JOIN: `em.find(Producto, { etiquetas: { nombre: 'gamer' } })`.
- `cascade` controla qué pasa con los hijos al persistir o borrar el padre; por defecto MikroORM cascadea `persist` pero no `remove`.
- `@OneToOne` existe y es el caso menos frecuente: casi siempre que aparece, esos datos podrían estar en la misma tabla.
