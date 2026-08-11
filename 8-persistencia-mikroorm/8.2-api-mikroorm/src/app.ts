import express from 'express';
import { RequestContext } from '@mikro-orm/core';
import { orm } from './db.js';
import { productosRouter } from './routes/productos.routes.js';
import { errorHandler } from './shared/errorHandler.js';

const app = express();

app.use(express.json());

// ============================================================================
// EL MIDDLEWARE MÁS IMPORTANTE DE LA UNIDAD
// ============================================================================
// RequestContext crea un fork del EntityManager para CADA request y lo deja
// disponible durante todo su ciclo de vida. A partir de acá, `orm.em` dentro
// del repository devuelve el fork de ESE request, no uno compartido.
//
// Qué pasa si se olvida (vale probarlo comentando estas dos líneas):
//   - Todos los requests comparten un identity map que nunca se vacía. Es una
//     fuga de memoria que crece con el uptime del servidor.
//   - Peor: dos usuarios distintos pueden ver entidades del otro, y un flush
//     puede terminar guardando cambios a medio hacer de otro request.
//   - Con requests concurrentes, MikroORM directamente tira
//     "Using global EntityManager instance methods for context specific
//      actions is disallowed".
//
// Es la traducción a HTTP del em.fork() del ejemplo 8.1.3: un request es una
// unidad de trabajo.
// ============================================================================
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use('/api/productos', productosRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000/');
});
