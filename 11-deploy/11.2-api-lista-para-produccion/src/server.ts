import { app } from './app.js';
import { orm } from './db.js';
import { env } from './config/env.js';

// ============================================================================
// EL ARRANQUE
// ============================================================================
// Todo lo que en tu máquina daba igual y en un servidor no. Está explicado en
// detalle en el ejemplo 11.1; acá se aplica sobre la API de verdad, que además
// tiene una conexión a base de datos que hay que cerrar bien.
// ============================================================================

// El puerto lo asigna la plataforma. Aferrarse al 3000 es escuchar donde nadie
// te habla: el deploy termina en "no open ports detected".
//
// '0.0.0.0' es "aceptá conexiones por cualquier interfaz". Escuchar en
// 'localhost' adentro de un contenedor significa "solo desde adentro del
// contenedor", y el proxy de la plataforma queda del lado de afuera.
const server = app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${env.PORT}`);
  console.log(`Ambiente: ${env.NODE_ENV}`);
  console.log(`CORS habilitado para: ${env.CORS_ORIGIN.join(', ')}`);
});

// ============================================================================
// APAGARSE BIEN
// ============================================================================
// Para publicar una versión nueva, la plataforma no mata el proceso viejo: le
// manda SIGTERM y espera unos segundos. Si lo ignorás, llega SIGKILL, que no
// se puede ignorar, y se corta todo en el medio.
//
// El orden de acá abajo importa:
//   1. Dejar de aceptar requests nuevos y terminar los que están en curso.
//   2. Recién ahí cerrar la conexión a la base.
//
// Al revés, los requests que estaban a mitad de camino se encuentran con la
// base cerrada y contestan 500 justo durante el deploy.
// ============================================================================
const apagar = async (senal: string) => {
  console.log(`${senal} recibido: cerrando ordenadamente...`);

  server.close(async () => {
    await orm.close();
    console.log('Servidor y base cerrados. Chau.');
    process.exit(0);
  });

  // Red de seguridad: si en 10 segundos algo quedó colgado, se corta igual.
  // Sin esto, una conexión abierta puede dejar el proceso vivo para siempre.
  setTimeout(() => {
    console.error('El cierre ordenado tardó demasiado. Saliendo a la fuerza.');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGTERM', () => void apagar('SIGTERM'));
process.on('SIGINT', () => void apagar('SIGINT'));
