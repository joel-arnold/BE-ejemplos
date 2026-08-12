import { app } from './app.js';

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
