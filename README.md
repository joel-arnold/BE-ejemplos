# Material Backend (UTN)

Repositorio de ejemplos para la materia de backend, organizado por temas y por nivel de complejidad.

El contenido va desde fundamentos de JavaScript, pasando por TypeScript, hasta APIs REST con Express y persistencia en MongoDB/MySQL/MikroORM.

## Estructura general

### 1 a 5 - Fundamentos de JavaScript

- `1-sintaxisBasica/`: `let`, `const`, arreglos, condicionales (`if`, igualdad, `switch`), bucles e iteración (`for`, `forEach`, `for...of`, `for...in`).
- `2-funciones/`: declaraciones y expresiones de funciones, scope, hoisting, recursión, funciones flecha, funciones de orden superior (parámetro y retorno) y `forEach`.
- `3-asincronía/`: ejecución asincrónica y event loop, callbacks (simple, error-first, callback hell), promisify, promesas, async/await, manejo de errores, paralelismo (`Promise.all`) y `fetch`.
- `4-objetos/`: propiedades, métodos, literales, prototipos, `Object.create`, funciones constructoras, herencia, fábrica de objetos, paso por compartición (call-by-sharing) y mutabilidad.
- `5-clases/`: definición de clases y propiedades privadas.

### 6 - TypeScript

- `6-typescriptConfig/`: ejemplo base de configuración TS + `tsc-watch`.
- Incluye guía de setup en `ts-setup-steps.md`.

### 7 - Express y persistencia

- `7-express/7.1-express-simple-api/`: API REST simple en memoria (sin base de datos).
- `7-express/7.2-express-api-project-architecture/`: misma API con arquitectura por capas/módulos.
- `7-express/7.3-express-api-mongodb/`: API con repositorio en MongoDB (driver `mongodb`).
- `7-express/7.4-express-api-mysql/`: API con repositorio en MySQL (`mysql2`).
- `7-express/7.5-express-api-mikroorm/`: API con MikroORM + MySQL.
- `7-express/7.6-express-api-mikroorm-mongodb/`: API con MikroORM + MongoDB.

## Requisitos

- Node.js 18+ recomendado.
- pnpm recomendado (los módulos incluyen `pnpm-lock.yaml`).
- Docker opcional para levantar MongoDB/MySQL rápidamente.

## Cómo ejecutar

### Ejemplos de JavaScript puro (carpetas 1 a 5)

Las carpetas de la 1 a la 5 no requieren instalación. Se pueden ejecutar con Node de forma directa:

```bash
node 1-sintaxisBasica/1.1-let.js
```

### Módulos con `package.json` (carpetas 6 y 7)

Cada módulo con `package.json` se ejecuta de forma independiente.

1. Entrar al directorio del módulo.
2. Instalar dependencias.
3. Ejecutar en modo desarrollo.

Ejemplo (cambiar por el módulo que quieras):

```bash
cd 7-express/7.1-express-simple-api
pnpm install
pnpm start:dev
```

#### Scripts disponibles

- `start:dev`: compila con `tsc-watch` y ejecuta `dist/app.js` o `dist/index.js` según el módulo.
- `build`: disponible en `6-typescriptConfig` para compilar TypeScript (`tsc -p ./tsconfig.json`).

## APIs y pruebas rápidas

Todos los proyectos Express levantan en:

- `http://localhost:3000`

Rutas base más comunes:

- `GET /api/characters`
- `GET /api/characters/:id`
- `POST /api/characters`
- `PUT /api/characters/:id`
- `PATCH /api/characters/:id`
- `DELETE /api/characters/:id`

Para probar endpoints hay archivos `.http` en cada módulo de API.

## Notas de base de datos

### MongoDB (`7-express/7.3-express-api-mongodb`)

- Conexión por defecto: `mongodb://127.0.0.1:27017/`
- Base por defecto: `heroclash4geeks`
- Variable soportada: `MONGO_URI`
- Referencias: `docs/setup.md` y `docs/mongodb-commands.js`

### MySQL (`7-express/7.4-express-api-mysql`)

- Host: `localhost`
- Usuario: `dsw`
- Password: `dsw`
- Base: `heroclash4geeks`
- Variables soportadas: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Script SQL: `docs/mysql-commands.sql`

### MikroORM + MySQL (`7-express/7.5-express-api-mikroorm`)

- `clientUrl`: `mysql://dsw:dsw@localhost:3306/hc4gmo`
- `dbName`: `hc4gmo`
- Incluye sincronización de esquema para desarrollo (`syncSchema()`).
- Referencias: `docs/setup.md` y `docs/project.md`

### MikroORM + MongoDB (`7-express/7.6-express-api-mikroorm-mongodb`)

- `clientUrl`: `mongodb://localhost:27017`
- `dbName`: `hc4gmo`
- Referencias: `docs/setup.md` y `docs/project.md`

## Observaciones

- Es un repositorio de aprendizaje progresivo: cada carpeta muestra una idea puntual.
- Algunos metadatos de `package.json` están reutilizados entre módulos (por ejemplo `name`), pero los ejemplos funcionan de forma independiente.

## Tabla comparativa de APIs (7.1 a 7.6)

| Módulo | Enfoque | Persistencia | Arquitectura | Complejidad sugerida |
| --- | --- | --- | --- | --- |
| `7.1-express-simple-api` | CRUD básico con Express | Memoria (array) | Archivo único con rutas | Baja |
| `7.2-express-api-project-architecture` | Separación por capas | Memoria (repositorio en código) | Rutas + controlador + repositorio + entidad | Baja-media |
| `7.3-express-api-mongodb` | CRUD con driver nativo | MongoDB (`mongodb`) | Capas + conexión compartida + repositorio | Media |
| `7.4-express-api-mysql` | CRUD SQL con joins y tablas relacionadas | MySQL (`mysql2`) | Capas + pool + repositorio SQL | Media |
| `7.5-express-api-mikroorm` | ORM para modelo relacional | MySQL (MikroORM) | Entidades + mapeo relacional + RequestContext | Media-alta |
| `7.6-express-api-mikroorm-mongodb` | ODM/ORM orientado a documentos | MongoDB (MikroORM) | Entidades + mapeo documento + RequestContext | Media-alta |

Orden recomendado de recorrido:

1. `7.1` para entender el flujo CRUD en HTTP.
2. `7.2` para incorporar estructura de proyecto.
3. `7.3` y `7.4` para comparar acceso a datos en NoSQL vs SQL.
4. `7.5` y `7.6` para abstraer la persistencia con MikroORM.
