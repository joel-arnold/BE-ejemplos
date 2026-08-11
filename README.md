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

### 9 - Autenticación y autorización

Ejemplos que acompañan la clase "Autenticación y autorización". Mismo caso mínimo (`productos`) que las unidades 6, 7 y 8, ahora con usuarios: hasta acá cualquiera podía borrar cualquier cosa. Detalle y mapa a la clase en `9-autenticacion/README.md`.

- `9-autenticacion/9.1-hash-contrasenas/`: por qué texto plano, cifrado y SHA-256 fallan; salt, cost factor y `compare()` con bcrypt.
- `9-autenticacion/9.2-jwt-anatomia/`: las tres partes de un JWT, el payload que se lee sin secret, tres intentos de falsificarlo y la expiración.
- `9-autenticacion/9.3-api-auth/`: el ejemplo `8.2` con `.env`, registro, login, middleware de autenticación y autorización por rol y por dueño.
- `9-autenticacion/9.4-cors/`: CORS desde un navegador de verdad — el error real, el preflight y cuatro formas de configurarlo.

## Pendientes

Temas y unidades que se van a incorporar más adelante, junto con su material de clase/alumno.

- `10-testing-jest/` — **Testing** con Jest: probar los services mockeando el repository.
- `11-deploy/` — **Deploy**: lo mínimo y necesario para publicar la API.

## Requisitos

- Node.js 18+ recomendado.
- npm (la unidad 6 usa npm; JavaScript puro, sin paso de compilación).
- La unidad 7 suma TypeScript: se instala por proyecto (`devDependencies`), no hace falta nada global.
- La unidad 8 suma **MySQL** corriendo en `localhost:3306`. Las bases se crean solas (`ensureDatabase()`); lo único que puede hacer falta es corregir usuario y contraseña en el `mikro-orm.config.ts` de cada carpeta, que asumen `root`/`root`.
- La unidad 9 suma un **archivo `.env`** en el ejemplo `9.3` (`cp .env.example .env`): ahí las credenciales dejan de estar en el código. El `9.4` necesita además un **navegador**, porque CORS no existe fuera de él.

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

### Unidad 9 - Autenticación (con `.env`)

Los ejemplos `9.1` y `9.2` no necesitan nada: `npm install` y a correr los scripts (`npm run plano`, `npm run anatomia`, ...).

El `9.3` es el único de todo el repositorio que **no arranca sin configurar**, y es a propósito — es el tema del bloque:

```bash
cd 9-autenticacion/9.3-api-auth
cp .env.example .env      # Windows: copy .env.example .env
npm install
npm run dev
```

Usa su propia base, `dsw_auth`. Si falta una variable o el secret es corto, la API no levanta y dice qué falta.

El `9.4` levanta **dos servidores** y se mira en el navegador, no en un `.http`:

```bash
cd 9-autenticacion/9.4-cors
npm install
npm run api      # terminal 1 - :3000
npm run front    # terminal 2 - :5173  -> abrir en el navegador con F12
```

## APIs y pruebas rápidas

Los proyectos Express de las unidades 6, 7, 8 y 9 levantan en:

- `http://localhost:3000`

Rutas base:

- `GET /api/productos`
- `POST /api/productos`
- `GET /api/usuarios` y `POST /api/usuarios` (solo en el ejemplo por feature, `6.4`)
- `POST /api/auth/registro` y `POST /api/auth/login` (unidad 9)

Para probar los endpoints hay archivos `.http` en cada carpeta.

## Observaciones

- Es un repositorio de aprendizaje progresivo: cada carpeta muestra una idea puntual.
- La unidad 6 usa siempre el mismo caso (`productos`) para que entre un ejemplo y el siguiente se note el cambio de estructura, no el cambio de dominio. Las unidades 7, 8 y 9 siguen con ese mismo caso por la misma razón.
- Los ejemplos `6.3` → `7.2` → `7.3` → `8.2` → `9.3` son el mismo proyecto en cinco etapas: capas, tipos, validación, persistencia y autenticación. Abrir dos consecutivos lado a lado es la mejor forma de ver qué agrega cada unidad.
