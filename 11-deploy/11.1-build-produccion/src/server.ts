import { app } from './app.js';

// ============================================================================
// EL ARRANQUE
// ============================================================================
// Todo lo que en desarrollo daba igual y en un servidor de verdad no.
// ============================================================================

// ── 1. EL PUERTO NO LO ELEGÍS VOS ───────────────────────────────────────────
// Hasta hoy el puerto fue siempre 3000 porque lo escribimos nosotros. En un
// hosting, la plataforma levanta muchas aplicaciones en la misma máquina y le
// asigna un puerto a cada una por variable de entorno. Si tu aplicación se
// aferra al 3000, escucha en un puerto al que nadie le va a hablar, la
// plataforma no recibe respuesta y el deploy falla con un mensaje del estilo
// "no open ports detected".
//
// Es, por lejos, el error número uno del primer deploy de cualquiera.
const PORT = Number(process.env.PORT) || 3000;

// ── 2. LA INTERFAZ TAMPOCO ──────────────────────────────────────────────────
// '0.0.0.0' significa "aceptá conexiones por cualquier interfaz de red".
// Escuchar en 'localhost' (127.0.0.1) significa "solo desde esta máquina", que
// dentro de un contenedor quiere decir "solo desde adentro del contenedor": el
// proxy de la plataforma queda afuera y no llega nadie.
//
// En tu máquina los dos funcionan igual. Por eso este error no aparece nunca
// hasta el deploy.
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV ?? 'development'}`);
});

// ── 3. APAGARSE BIEN ────────────────────────────────────────────────────────
// Cuando la plataforma quiere reemplazar tu aplicación por una versión nueva,
// no la mata: le manda la señal SIGTERM y espera. Si la ignorás, a los pocos
// segundos te manda SIGKILL, que no se puede ignorar, y ahí sí se corta todo
// en el medio — incluidos los requests que estaban a mitad de camino.
//
// Escuchar SIGTERM y cerrar ordenadamente es lo que hace que un deploy no
// tire error a los usuarios que justo estaban usando la aplicación.
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido: cerrando el servidor...');

  server.close(() => {
    console.log('Servidor cerrado. Chau.');
    process.exit(0);
  });
});
