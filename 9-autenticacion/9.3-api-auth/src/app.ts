import express from 'express';
import cors from 'cors';
import { RequestContext } from '@mikro-orm/core';
import { env } from './config/env.js';
import { orm } from './db.js';
import { productosRouter } from './routes/productos.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { errorHandler } from './shared/errorHandler.js';

const app = express();

// ============================================================================
// CORS - el middleware que arregla el error que va a aparecer en el front
// ============================================================================
// Va PRIMERO, antes que todo lo demás. Si un error se produce más abajo y la
// respuesta sale sin los headers de CORS, el navegador la bloquea y el front
// ve un error de CORS en vez del 500 real. Depurar eso es un dolor.
//
// origin le dice al navegador desde qué página se permite llamar a esta API.
// Sale del .env porque cambia por ambiente: en desarrollo es localhost, en
// producción es el dominio del front.
//
// Lo que NO hay que hacer, aunque "arregle" el problema al instante:
//
//   app.use(cors());                 // ← origin: '*', cualquier página del mundo
//
// Con '*' cualquier sitio puede llamar a la API desde el navegador de tu
// usuario. Para una API pública de solo lectura puede estar bien; para una con
// login, no.
//
// El detalle completo, con el error real del navegador y el preflight, en el
// ejemplo 9.4.
// ============================================================================
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    // Los métodos y headers que el front puede usar. Si se declara la lista de
    // headers, Authorization tiene que estar sí o sí: sin él, el navegador
    // bloquea todo request que lleve el token, y el GET público sigue andando
    // como si nada. Es EL error de CORS de esta unidad — ejemplo 9.4, modo
    // 'sin-auth'.
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

// Un fork del EntityManager por request (unidad 8).
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use('/api/auth', authRouter);
app.use('/api/productos', productosRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${env.PORT}/`);
  console.log(`CORS habilitado para ${env.CORS_ORIGIN}`);
});
