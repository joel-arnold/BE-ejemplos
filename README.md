# Material Backend (UTN)

Repositorio de ejemplos para la materia de backend, organizado por temas y por nivel de complejidad.

El contenido va desde fundamentos de JavaScript, pasando por TypeScript, hasta APIs REST con Express y persistencia en MongoDB/MySQL/MikroORM.

## Estructura general

### 02 - Fundamentos de JavaScript

- `02.01-sintaxisBasica/`: `let`, `const`, arreglos, condicionales, switch, bucles, iteracion.
- `02.02-funciones/`: declaraciones y expresiones de funciones, scope, hoisting, recursion, HOF (parametro y retorno), `forEach`.
- `02.03-asincronia/`: ejecucion asincronica, callbacks (simple, error-first, callback hell), promisify, promesas, async/await, manejo de errores, paralelismo (`Promise.all`), `fetch`.
- `02.04-objetos/`: propiedades, metodos, literales, prototipos, `Object.create`, constructores, herencia, factory.
- `02.04-objetos/` (continuacion): paso por comparticion (call-by-sharing) y mutabilidad (`04.10-pasoPorComparticion.js`, `04.11-modificarValores.js`).
- `02.06-clases/`: definicion de clases y propiedades privadas.

### 04 - TypeScript

- `04.01-typescriptConfig/`: ejemplo base de configuracion TS + `tsc-watch`.
- Incluye guia de setup en `ts-setup-steps.md`.

### 05 - Express y persistencia

- `05.01-express-simple-api/`: API REST simple en memoria (sin base de datos).
- `05.02-express-api-project-architecture/`: misma API con arquitectura por capas/modulos.
- `05.03-express-api-mongodb/`: API con repositorio en MongoDB (`mongodb` driver).
- `05.04-express-api-mysql/`: API con repositorio en MySQL (`mysql2`).
- `05.05-express-api-mikroorm/`: API con MikroORM + MySQL.
- `05.06-express-api-mikroorm-mongodb/`: API con MikroORM + MongoDB.

## Requisitos

- Node.js 18+ recomendado.
- pnpm recomendado (los modulos incluyen `pnpm-lock.yaml`).
- Docker opcional para levantar MongoDB/MySQL rapidamente.

## Como ejecutar

Cada modulo con `package.json` se ejecuta de forma independiente.

1. Entrar al directorio del modulo.
2. Instalar dependencias.
3. Ejecutar en modo desarrollo.

Ejemplo (cambiar por el modulo que quieras):

```bash
cd 05.01-express-simple-api
pnpm install
pnpm start:dev
```

### Scripts disponibles

- `start:dev`: compila con `tsc-watch` y ejecuta `dist/app.js` o `dist/index.js` segun el modulo.
- `build`: disponible en `04.01-typescriptConfig` para compilar TypeScript (`tsc -p ./tsconfig.json`).

## Ejecucion de ejemplos JavaScript puros

Las carpetas de la serie `02.xx` no requieren instalacion. Se pueden ejecutar con Node de forma directa:

```bash
node 02.01-sintaxisBasica/01.01-let.js
```

## APIs y pruebas rapidas

Todos los proyectos Express levantan en:

- `http://localhost:3000`

Rutas base mas comunes:

- `GET /api/characters`
- `GET /api/characters/:id`
- `POST /api/characters`
- `PUT /api/characters/:id`
- `PATCH /api/characters/:id`
- `DELETE /api/characters/:id`

Para probar endpoints hay archivos `.http` en cada modulo de API.

## Notas de base de datos

### MongoDB (`05.03-express-api-mongodb`)

- Conexion por defecto: `mongodb://127.0.0.1:27017/`
- Base por defecto: `heroclash4geeks`
- Variable soportada: `MONGO_URI`
- Referencias: `docs/setup.md` y `docs/mongodb-commands.js`

### MySQL (`05.04-express-api-mysql`)

- Host: `localhost`
- Usuario: `dsw`
- Password: `dsw`
- Base: `heroclash4geeks`
- Variables soportadas: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Script SQL: `docs/mysql-commands.sql`

### MikroORM + MySQL (`05.05-express-api-mikroorm`)

- `clientUrl`: `mysql://dsw:dsw@localhost:3306/hc4gmo`
- `dbName`: `hc4gmo`
- Incluye sincronizacion de esquema para desarrollo (`syncSchema()`).
- Referencias: `docs/setup.md` y `docs/project.md`

### MikroORM + MongoDB (`05.06-express-api-mikroorm-mongodb`)

- `clientUrl`: `mongodb://localhost:27017`
- `dbName`: `hc4gmo`
- Referencias: `docs/setup.md` y `docs/project.md`

## Observaciones

- Es un repositorio de aprendizaje progresivo: cada carpeta muestra una idea puntual.
- Algunos metadatos de `package.json` estan reutilizados entre modulos (por ejemplo `name`), pero los ejemplos funcionan de forma independiente.

## Tabla comparativa de APIs (05.01 a 05.06)

| Modulo | Enfoque | Persistencia | Arquitectura | Complejidad sugerida |
| --- | --- | --- | --- | --- |
| `05.01-express-simple-api` | CRUD basico con Express | Memoria (array) | Archivo unico con rutas | Baja |
| `05.02-express-api-project-architecture` | Separacion por capas | Memoria (repositorio en codigo) | Rutas + controlador + repositorio + entidad | Baja-media |
| `05.03-express-api-mongodb` | CRUD con driver nativo | MongoDB (`mongodb`) | Capas + conexion compartida + repositorio | Media |
| `05.04-express-api-mysql` | CRUD SQL con joins y tablas relacionadas | MySQL (`mysql2`) | Capas + pool + repositorio SQL | Media |
| `05.05-express-api-mikroorm` | ORM para modelo relacional | MySQL (MikroORM) | Entidades + mapeo relacional + RequestContext | Media-alta |
| `05.06-express-api-mikroorm-mongodb` | ODM/ORM orientado a documentos | MongoDB (MikroORM) | Entidades + mapeo documento + RequestContext | Media-alta |

Orden recomendado de recorrido:

1. `05.01` para entender flujo CRUD en HTTP.
2. `05.02` para incorporar estructura de proyecto.
3. `05.03` y `05.04` para comparar acceso a datos en NoSQL vs SQL.
4. `05.05` y `05.06` para abstraer persistencia con MikroORM.