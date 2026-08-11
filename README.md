# Material Backend (UTN)

Repositorio de ejemplos para la materia de backend, organizado por temas y por nivel de complejidad.

El contenido va desde fundamentos de JavaScript hasta APIs REST con Express y distintas formas de estructurar un proyecto.

## Estructura general

### 1 a 5 - Fundamentos de JavaScript

- `1-sintaxisBasica/`: `let`, `const`, arreglos, condicionales (`if`, igualdad, `switch`), bucles e iteración (`for`, `forEach`, `for...of`, `for...in`).
- `2-funciones/`: declaraciones y expresiones de funciones, scope, hoisting, recursión, funciones flecha, funciones de orden superior (parámetro y retorno) y `forEach`.
- `3-asincronía/`: ejecución asincrónica y event loop, callbacks (simple, error-first, callback hell), promisify, promesas, async/await, manejo de errores, paralelismo (`Promise.all`) y `fetch`.
- `4-objetos/`: propiedades, métodos, literales, prototipos, `Object.create`, funciones constructoras, herencia, fábrica de objetos, paso por compartición (call-by-sharing) y mutabilidad.
- `5-clases/`: `class` como azúcar sobre prototipos, anatomía de una clase, getters y setters, campos privados (`#`) y miembros estáticos, herencia (`extends`/`super`) y polimorfismo, el `this` que se pierde al pasar un método como callback, composición vs. herencia y clases con JSON. Detalle y mapa a la clase en `5-clases/README.md`.

A partir de la unidad 5 los ejemplos usan el mismo caso mínimo que el resto del material (`productos` con `nombre` y `precio`), en vez del `Persona` de las unidades 1 a 4.

### 6 - Express y arquitecturas de API

Ejemplos que acompañan la clase "Arquitecturas en APIs de Node.js". Cada carpeta muestra brevemente un bloque de la clase con el mismo caso mínimo (`productos`), en **JavaScript puro** (ESM, sin compilación). Detalle y mapa a la clase en `6-express-arquitecturas/README.md`.

- `6-express-arquitecturas/6.1-http-nativo/`: la API con el módulo `http` nativo (sin Express).
- `6-express-arquitecturas/6.2-express-un-archivo/`: la misma API con Express, todo en un archivo.
- `6-express-arquitecturas/6.3-arquitectura-capas/`: routes + controllers + services + repositories por rol técnico.
- `6-express-arquitecturas/6.4-arquitectura-feature/`: las mismas capas, organizadas por feature (dos recursos).
- `6-express-arquitecturas/6.5-arquitectura-hexagonal/`: puertos y adaptadores (Hexagonal / Clean, versión light).

### 7 - TypeScript

Ejemplos que acompañan la clase "De JavaScript a TypeScript". Mismo caso mínimo (`productos`) que la unidad 6, para que se vea qué agregan los tipos y no un dominio nuevo. A diferencia de las carpetas anteriores, acá **hay paso de compilación**. Detalle y mapa a la clase en `7-typescript/README.md`.

- `7-typescript/7.1-fundamentos/`: el lenguaje en cinco archivos — tipos e inferencia, funciones, objetos, clases y genéricos.
- `7-typescript/7.2-api-capas-ts/`: el ejemplo `6.3` migrado a TypeScript, capa por capa.
- `7-typescript/7.3-validacion-zod/`: validación en runtime con Zod y el tipo derivado del esquema (`z.infer`).
- `7-typescript/7.4-migracion-gradual/`: un proyecto a medio migrar, con `.js` y `.ts` conviviendo.

### 8 - Persistencia: MikroORM + MySQL

Ejemplos que acompañan la clase "Persistencia: MikroORM + MySQL". Mismo caso mínimo (`productos`) que las unidades 6 y 7, ahora contra una base de datos real: el repository deja de ser un array. Requieren un **MySQL** andando en `localhost:3306`. Detalle y mapa a la clase en `8-persistencia-mikroorm/README.md`.

- `8-persistencia-mikroorm/8.1-primer-contacto/`: conexión, entidad, esquema, CRUD, y los patrones *unit of work* e *identity map*.
- `8-persistencia-mikroorm/8.2-api-mikroorm/`: el ejemplo `7.3` con el repository sobre MySQL — el service queda intacto.
- `8-persistencia-mikroorm/8.3-relaciones/`: uno a muchos, muchos a muchos, `populate` y el problema N+1.
- `8-persistencia-mikroorm/8.4-migraciones/`: el esquema como código versionado, en vez de `schema.update()`.

## Pendientes

Temas y unidades que se van a incorporar más adelante, junto con su material de clase/alumno.

- `9-autenticacion/` — **Autenticación y autorización**: hash de contraseñas, JWT y middleware de auth, más CORS y variables de entorno.
- `10-testing-jest/` — **Testing** con Jest: probar los services mockeando el repository.
- `11-deploy/` — **Deploy**: lo mínimo y necesario para publicar la API.

## Requisitos

- Node.js 18+ recomendado.
- npm (la unidad 6 usa npm; JavaScript puro, sin paso de compilación).
- La unidad 7 suma TypeScript: se instala por proyecto (`devDependencies`), no hace falta nada global.
- La unidad 8 suma **MySQL** corriendo en `localhost:3306`. Las bases se crean solas (`ensureDatabase()`); lo único que puede hacer falta es corregir usuario y contraseña en el `mikro-orm.config.ts` de cada carpeta, que asumen `root`/`root`.

## Cómo ejecutar

### Ejemplos de JavaScript puro (carpetas 1 a 5)

Las carpetas de la 1 a la 5 no requieren instalación. Se ejecutan con Node de forma directa:

```bash
node 1-sintaxisBasica/1.1-let.js
```

### Unidad 6 - Express (carpetas con `package.json`)

Cada ejemplo de `6-express-arquitecturas/` es un proyecto independiente. Se corre así (cambiar por el ejemplo que quieras):

```bash
cd 6-express-arquitecturas/6.2-express-un-archivo
npm install
npm run dev       # con recarga automática (nodemon)
# o bien: npm start
```

### Unidad 7 - TypeScript (con compilación)

Igual que la unidad 6, más el paso de `tsc`:

```bash
cd 7-typescript/7.2-api-capas-ts
npm install

npm run dev       # tsx ejecuta el .ts directo y recarga al guardar
npm run check     # solo chequea tipos (tsc --noEmit)

npm run build     # compila src/ -> dist/
npm start         # corre lo compilado: node dist/app.js
```

El proyecto `7.1-fundamentos` no levanta servidor: tiene un script por archivo (`npm run tipos`, `npm run funciones`, ...).

### Unidad 8 - Persistencia (con MySQL)

Igual que la unidad 7, más una base de datos andando:

```bash
cd 8-persistencia-mikroorm/8.2-api-mikroorm
npm install
npm run dev
```

Los ejemplos sin servidor tienen un script por archivo: `npm run crud` y `npm run uow` en `8.1`, `npm run populate` en `8.3`, `npm run estado` en `8.4`. Todos corren con `debug: true`: **el SQL que genera el ORM sale por consola**, y leerlo es la mitad del ejercicio.

Cada ejemplo usa su propia base para no pisarse: `dsw_persistencia` (8.1 y 8.2), `dsw_relaciones` (8.3) y `dsw_migraciones` (8.4).

## APIs y pruebas rápidas

Los proyectos Express de las unidades 6, 7 y 8 levantan en:

- `http://localhost:3000`

Rutas base:

- `GET /api/productos`
- `POST /api/productos`
- `GET /api/usuarios` y `POST /api/usuarios` (solo en el ejemplo por feature, `6.4`)

Para probar los endpoints hay archivos `.http` en cada carpeta.

## Observaciones

- Es un repositorio de aprendizaje progresivo: cada carpeta muestra una idea puntual.
- La unidad 6 usa siempre el mismo caso (`productos`) para que entre un ejemplo y el siguiente se note el cambio de estructura, no el cambio de dominio. Las unidades 7 y 8 siguen con ese mismo caso por la misma razón.
- Los ejemplos `6.3` → `7.2` → `7.3` → `8.2` son el mismo proyecto en cuatro etapas: capas, tipos, validación y persistencia. Abrir dos consecutivos lado a lado es la mejor forma de ver qué agrega cada unidad.
