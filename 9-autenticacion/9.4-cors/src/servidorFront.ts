// ============================================================================
// UN SERVIDOR ESTÁTICO PARA EL FRONT
// ============================================================================
// Correr con: npm run front   -> http://localhost:5173
//
// Lo único que hace es servir public/index.html. Existe por una razón: el
// front tiene que estar en un ORIGEN DISTINTO de la API para que CORS entre en
// juego.
//
// Abrir el HTML con doble clic (file://) no sirve para este ejercicio: el
// origen de un archivo local es `null`, un caso especial que se comporta
// distinto. Hace falta que sea http://localhost:5173 contra
// http://localhost:3000.
//
// Y sí: mismo host, distinto puerto YA ES otro origen. Un origen es la terna
// esquema + host + puerto, y los tres tienen que coincidir.
// ============================================================================

import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const aca = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static(join(aca, '..', 'public')));

app.listen(5173, () => {
  console.log('Front en http://localhost:5173  (la API tiene que estar en :3000)');
});
