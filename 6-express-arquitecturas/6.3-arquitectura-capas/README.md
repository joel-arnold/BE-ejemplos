# 6.3 - Arquitectura en capas (por rol técnico)

> Clase "Arquitecturas en APIs de Node.js" · **Bloque 3** y **Bloque 4** (organización por rol técnico)

El `POST` de [6.2](../6.2-express-un-archivo/), que mezclaba cuatro responsabilidades, ahora repartido en **capas**. Cada pieza vive en su propia carpeta y cada capa solo habla con la de al lado.

## Las capas

| Capa | Responsabilidad | ¿Conoce Express? | ¿Conoce la base de datos? |
| --- | --- | --- | --- |
| **routes** | Mapean método + URL a un controller. | Sí | No |
| **controllers** | Hablan HTTP: leen `req`, llaman al service, arman la respuesta. | Sí | No |
| **services** | Lógica de negocio: reglas y validaciones. | **No** | No |
| **repositories** | El único acceso a los datos (array, MongoDB, MySQL...). | No | **Sí** |

Más el **middleware** transversal (`shared/`): manejo de errores centralizado, y donde irían auth, logging y validación de entrada.

## El recorrido de un request

```
POST /api/productos
  → express.json() y demás middlewares globales
  → productos.routes    (matchea la URL)
  → productos.controller (lee el body, llama al service)
  → productos.service    (valida las reglas de negocio)
  → productos.repository (guarda los datos)
  ← la respuesta vuelve por el mismo camino
```

## Organización de carpetas: por rol técnico

```
src/
├── routes/          productos.routes.js
├── controllers/     productos.controller.js
├── services/        productos.service.js
├── repositories/    productos.repository.js
├── shared/          errors.js, errorHandler.js
└── app.js
```

Cada carpeta agrupa un **tipo de archivo**. Intuitivo con pocos recursos; el costo aparece al crecer (para tocar "productos" hay que saltar entre cuatro carpetas). La alternativa —agrupar **por feature**— está en [6.4](../6.4-arquitectura-feature/).

## Lo que se gana

- Cambiar el array por MongoDB toca **un solo archivo**: el repository.
- La lógica de negocio se testea llamando a `crearProducto()` directo, **sin levantar el servidor**.
- Autenticación, validación y errores se resuelven **una vez** como middleware.

La regla que ordena todo: **las dependencias apuntan en una dirección** — HTTP arriba, datos abajo, y el service sin depender de Express.

## Cómo ejecutar

```bash
npm install
npm run dev       # con recarga automática (nodemon)
# o bien: npm start
```
