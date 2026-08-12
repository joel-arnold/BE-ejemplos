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

### 10 - Testing con Jest

Ejemplos que acompañan la clase "Testing con Jest". Mismo caso mínimo (`productos`) que las unidades 6 a 9, ahora con la pregunta que veníamos esquivando: **¿cómo sabemos que esto anda?** Es la unidad más liviana desde la 7: **ninguno de los cuatro ejemplos necesita MySQL, `.env` ni servidor levantado**, y eso es el punto de la unidad, no una comodidad del ejemplo. Detalle y mapa a la clase en `10-testing-jest/README.md`.

- `10-testing-jest/10.1-primeros-tests/`: `describe`/`it`/`expect`, AAA, `toBe` vs `toEqual`, `it.each`, y la configuración de Jest con ESM + TypeScript comentada línea por línea.
- `10-testing-jest/10.2-service-inyeccion/`: el service del `9.3` con el repository inyectado — nueve tests sin base de datos.
- `10-testing-jest/10.3-mock-de-modulos/`: el mismo service **sin tocar una línea**, interceptando el import con `jest.unstable_mockModule`.
- `10-testing-jest/10.4-api-supertest/`: la API entera con requests de verdad — rutas, tokens, códigos HTTP y cobertura.

### 11 - Deploy

Ejemplos que acompañan la clase "Deploy", la última de la materia. Mismo caso mínimo (`productos`) que las unidades 6 a 10, ahora con lo único que le faltaba a la API: **existir fuera de tu máquina**. Entre el `9.3` y el `11.2` el código de negocio no cambia ni una línea — lo que cambia es de dónde sale la configuración, cómo arranca el proceso, cómo se apaga y cómo se conecta a la base. Son **tres ejemplos y no cuatro**, a propósito: el tema es ancho pero no profundo. Detalle, guía paso a paso y mapa a la clase en `11-deploy/README.md`.

- `11-deploy/11.1-build-produccion/`: de `tsx` a `dist/` — el build, qué se sube al servidor, y las tres cosas del arranque (puerto, `0.0.0.0`, `SIGTERM`) que en tu máquina daban igual.
- `11-deploy/11.2-api-lista-para-produccion/`: la API del `9.3` pasada por el checklist de producción, con TLS contra la base gestionada, migraciones en vez de `schema.update()` y `render.yaml`.
- `11-deploy/11.3-ci-github-actions/`: el workflow que corre `npm test` antes de publicar y se niega a subir una versión rota.

## Requisitos

- Node.js 18+ recomendado.
- npm (la unidad 6 usa npm; JavaScript puro, sin paso de compilación).
- La unidad 7 suma TypeScript: se instala por proyecto (`devDependencies`), no hace falta nada global.
- La unidad 8 suma **MySQL** corriendo en `localhost:3306`. Las bases se crean solas (`ensureDatabase()`); lo único que puede hacer falta es corregir usuario y contraseña en el `mikro-orm.config.ts` de cada carpeta, que asumen `root`/`root`.
- La unidad 9 suma un **archivo `.env`** en el ejemplo `9.3` (`cp .env.example .env`): ahí las credenciales dejan de estar en el código. El `9.4` necesita además un **navegador**, porque CORS no existe fuera de él.
- La unidad 10 **no suma nada**: ninguno de sus ejemplos necesita MySQL, `.env` ni servidor levantado. Jest se instala por proyecto, como el resto.
- La unidad 11 tampoco suma nada para correrla local: el `11.1` y el `11.3` no necesitan ni base ni `.env`, y el `11.2` se corre igual que el `9.3` (MySQL local y `.env`, con su propia base `dsw_deploy`). Para **publicarla** de verdad hacen falta dos cuentas gratuitas, [Aiven](https://aiven.io/) y [Render](https://render.com/), y **ninguna de las dos pide tarjeta**.

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

### Unidad 10 - Testing (sin nada andando)

```bash
cd 10-testing-jest/10.1-primeros-tests
npm install
npm test
```

Los cuatro ejemplos tienen los mismos scripts: `npm test`, `npm run test:watch` (vuelve a correr al guardar), `npm run test:cobertura` y `npm run check` (solo tipos). El `10.2` suma `npm start` (el mismo service contra el repository real) y el `10.4`, `npm run dev` para levantar la API y probarla con su `.http`.

Un detalle de Windows: el script de test es `node --experimental-vm-modules node_modules/jest/bin/jest.js` y no `NODE_OPTIONS=... jest`, que es lo que dice la documentación de Jest y **falla en la terminal de Windows**.

### Unidad 11 - Deploy

```bash
cd 11-deploy/11.1-build-produccion
npm install

npm run dev       # tsx, como veníamos
npm run build     # tsc: src/ -> dist/
npm start         # node dist/server.js, que es lo que corre el servidor
```

El `11.2` se corre igual que el `9.3` (`cp .env.example .env` y `npm run dev`), con su propia base `dsw_deploy`. El `11.3` es una suite de tests: `npm test`, `npm run check` y `npm run build`.

La guía paso a paso para publicar la API —crear la base en Aiven, el servicio en Render, cargar las variables y leer el log cuando falla— está en `11-deploy/11.2-api-lista-para-produccion/README.md`.

## APIs y pruebas rápidas

Los proyectos Express de las unidades 6 a 11 levantan en:

- `http://localhost:3000`

Rutas base:

- `GET /api/productos`
- `POST /api/productos`
- `GET /api/usuarios` y `POST /api/usuarios` (solo en el ejemplo por feature, `6.4`)
- `POST /api/auth/registro` y `POST /api/auth/login` (unidad 9)

Para probar los endpoints hay archivos `.http` en cada carpeta.

## Observaciones

- Es un repositorio de aprendizaje progresivo: cada carpeta muestra una idea puntual.
- La unidad 6 usa siempre el mismo caso (`productos`) para que entre un ejemplo y el siguiente se note el cambio de estructura, no el cambio de dominio. Las unidades 7 a 10 siguen con ese mismo caso por la misma razón.
- Los ejemplos `6.3` → `7.2` → `7.3` → `8.2` → `9.3` → `11.2` son el mismo proyecto en seis etapas: capas, tipos, validación, persistencia, autenticación y producción. Abrir dos consecutivos lado a lado es la mejor forma de ver qué agrega cada unidad.
- La unidad 10 retoma ese mismo service para testearlo: el `10.2` y el `10.3` resuelven el mismo problema por caminos opuestos (inyectar la dependencia o interceptar el import) y también se leen mejor lado a lado.
- El par `9.3` / `11.2` es el que más sorprende: los `services/`, `controllers/`, `entities/` y `schemas/` son **idénticos**. Todo lo que cambia para poder deployar está afuera del negocio.
