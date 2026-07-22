# Material Backend (UTN)

Repositorio de ejemplos para la materia de backend, organizado por temas y por nivel de complejidad.

El contenido va desde fundamentos de JavaScript hasta APIs REST con Express y distintas formas de estructurar un proyecto.

## Estructura general

### 1 a 5 - Fundamentos de JavaScript

- `1-sintaxisBasica/`: `let`, `const`, arreglos, condicionales (`if`, igualdad, `switch`), bucles e iteración (`for`, `forEach`, `for...of`, `for...in`).
- `2-funciones/`: declaraciones y expresiones de funciones, scope, hoisting, recursión, funciones flecha, funciones de orden superior (parámetro y retorno) y `forEach`.
- `3-asincronía/`: ejecución asincrónica y event loop, callbacks (simple, error-first, callback hell), promisify, promesas, async/await, manejo de errores, paralelismo (`Promise.all`) y `fetch`.
- `4-objetos/`: propiedades, métodos, literales, prototipos, `Object.create`, funciones constructoras, herencia, fábrica de objetos, paso por compartición (call-by-sharing) y mutabilidad.
- `5-clases/`: definición de clases y propiedades privadas.

### 6 - Express y arquitecturas de API

Ejemplos que acompañan la clase "Arquitecturas en APIs de Node.js". Cada carpeta muestra brevemente un bloque de la clase con el mismo caso mínimo (`productos`), en **JavaScript puro** (ESM, sin compilación). Detalle y mapa a la clase en `6-express-arquitecturas/README.md`.

- `6-express-arquitecturas/6.1-http-nativo/`: la API con el módulo `http` nativo (sin Express).
- `6-express-arquitecturas/6.2-express-un-archivo/`: la misma API con Express, todo en un archivo.
- `6-express-arquitecturas/6.3-arquitectura-capas/`: routes + controllers + services + repositories por rol técnico.
- `6-express-arquitecturas/6.4-arquitectura-feature/`: las mismas capas, organizadas por feature (dos recursos).
- `6-express-arquitecturas/6.5-arquitectura-hexagonal/`: puertos y adaptadores (Hexagonal / Clean, versión light).

## Pendientes

Temas y unidades que se van a incorporar más adelante, junto con su material de clase/alumno:

- **De JS a TS**: migración a TypeScript (configuración, tipos, `tsc`). *(Reemplaza a la vieja unidad `typescriptConfig`.)*
- **Persistencia de datos**: con MikroORM y motor MySQL.
- **Testing**: con Jest.

## Requisitos

- Node.js 18+ recomendado.
- npm (la unidad 6 usa npm; JavaScript puro, sin paso de compilación).

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

## APIs y pruebas rápidas

Los proyectos Express de la unidad 6 levantan en:

- `http://localhost:3000`

Rutas base:

- `GET /api/productos`
- `POST /api/productos`
- `GET /api/usuarios` y `POST /api/usuarios` (solo en el ejemplo por feature, `6.4`)

Para probar los endpoints hay archivos `.http` en cada carpeta.

## Observaciones

- Es un repositorio de aprendizaje progresivo: cada carpeta muestra una idea puntual.
- La unidad 6 usa siempre el mismo caso (`productos`) para que entre un ejemplo y el siguiente se note el cambio de estructura, no el cambio de dominio.
