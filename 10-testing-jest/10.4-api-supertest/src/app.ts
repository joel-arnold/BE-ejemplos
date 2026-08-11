import express, { type Express } from 'express';
import { crearProductosRouter } from './routes/productos.routes.js';
import { errorHandler } from './shared/errorHandler.js';
import type { ProductosService } from './services/productos.service.js';

// ============================================================================
// LA APP SE CONSTRUYE, NO SE IMPORTA — y no llama a listen()
// ============================================================================
// Dos decisiones acá, y las dos existen para que la API se pueda testear:
//
// 1. `crearApp` recibe el service. Es la misma inyección del 10.2, un piso más
//    arriba: el test arma la app con un service falso.
//
// 2. Este archivo NO llama a app.listen(). Eso vive en server.js. supertest
//    levanta el servidor él mismo en un puerto libre para cada request y lo
//    cierra al terminar; si `app.ts` ya estuviera escuchando en el 3000, los
//    tests fallarían con EADDRINUSE en cuanto corran dos a la vez.
//
// Separar "definir la app" de "ponerla a escuchar" es la única modificación que
// pide supertest, y conviene igual: en producción también sirve.
// ============================================================================

export function crearApp(service: ProductosService): Express {
  const app = express();

  app.use(express.json());
  app.use('/api/productos', crearProductosRouter(service));
  app.use(errorHandler);

  return app;
}
