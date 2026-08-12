import express from 'express';
import cors from 'cors';
import { RequestContext } from '@mikro-orm/core';
import { env, esProduccion } from './config/env.js';
import { orm } from './db.js';
import { productosRouter } from './routes/productos.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { errorHandler } from './shared/errorHandler.js';

// ============================================================================
// LA APP, SIN listen()
// ============================================================================
// El app.ts de la unidad 9 terminaba con app.listen(). Acá el arranque se fue
// a server.ts, y este archivo solo arma la aplicación y la exporta.
//
// Es la misma separación del ejemplo 10.4 (para que supertest levantara la app
// sin ocupar un puerto), y ahora cobra de nuevo: el arranque tiene que hacer
// varias cosas más —chequear la configuración, conectar la base, escuchar
// SIGTERM— y ninguna de esas es asunto de la aplicación.
// ============================================================================

export const app = express();

// ── Confiar en el proxy de la plataforma ────────────────────────────────────
// En la nube tu proceso no habla con el navegador: habla con un proxy que está
// adelante y que ya terminó el TLS. Sin esta línea, req.ip devuelve la IP del
// proxy para todos los usuarios y req.protocol dice 'http' aunque el usuario
// haya entrado por https.
//
// Importa cuando algo depende de eso: un rate limit por IP que limita a todo
// el mundo junto, o un redirect a https que se convierte en un bucle infinito.
if (esProduccion) {
  app.set('trust proxy', 1);
}

// ── CORS ────────────────────────────────────────────────────────────────────
// Va primero, como en la unidad 9. Lo que cambia es que `origin` ahora es una
// lista: en producción suele haber más de un front (el dominio de verdad, las
// previews, y localhost para desarrollar el front contra esta API).
//
// cors acepta un array directamente y compara contra él.
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

// ============================================================================
// EL HEALTHCHECK
// ============================================================================
// La ruta que la plataforma consulta cada pocos segundos para saber si seguís
// vivo. Si deja de contestar, da la instancia por muerta y la reinicia.
//
// Va ANTES del RequestContext a propósito: no necesita base, y no tiene que
// caerse si la base se cayó. Un healthcheck que consulta MySQL convierte una
// base lenta en un reinicio, y un reinicio en downtime.
//
// Barata, sin token, y sin contar nada: es una URL pública. Nada de versiones
// de librerías ni estado interno.
// ============================================================================
app.get('/health', (req, res) => {
  res.json({ estado: 'ok' });
});

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
