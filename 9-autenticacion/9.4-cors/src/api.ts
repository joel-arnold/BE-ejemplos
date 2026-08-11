// ============================================================================
// LA API, CON CORS QUE SE PRENDE Y SE APAGA
// ============================================================================
// Correr con: npm run api        (en otra terminal: npm run front)
//
// El modo se cambia con una variable de entorno, sin tocar código:
//
//   npm run api                       -> CORS apagado   (el front falla en todo)
//   CORS=abierto npm run api          -> origin: '*'     (anda, y está mal)
//   CORS=sin-auth npm run api         -> origen ok, pero SIN Authorization
//                                        (el GET anda y el POST con token no:
//                                         es EL error de esta clase)
//   CORS=estricto npm run api         -> lo correcto
//
// En PowerShell:  $env:CORS='estricto'; npm run api
//
// Sin base de datos: los productos son un array y el "login" acepta cualquier
// cosa. Acá el tema es CORS, no la persistencia.
// ============================================================================

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const SECRET = 'secret-de-ejemplo-solo-para-este-ejercicio-de-cors';
const ORIGEN_DEL_FRONT = 'http://localhost:5173';

const modo = process.env.CORS ?? 'apagado';

const app = express();

// ── El middleware de CORS va PRIMERO ──
// Si un error se produce más abajo y la respuesta sale sin los headers de
// CORS, el navegador la bloquea y el front ve un error de CORS en vez del 500
// real. Depurar eso es un dolor.
if (modo === 'abierto') {
  // origin: '*' — cualquier página del mundo puede llamar a esta API desde el
  // navegador de tu usuario. Para una API pública de solo lectura puede estar
  // bien; para una con login, no.
  app.use(cors());
} else if (modo === 'sin-auth') {
  // El origen está bien puesto y aun así el front falla — solo en las rutas
  // protegidas. Es el caso más difícil de diagnosticar de los cuatro, porque
  // "CORS ya lo configuré" y el GET efectivamente anda.
  //
  // El culpable es esa lista de allowedHeaders a la que le falta Authorization.
  // El preflight contesta que solo autoriza Content-Type, el navegador ve que
  // eso no alcanza y el POST nunca llega a salir.
  //
  // Ojo con un detalle que sorprende: si NO se pasa allowedHeaders, el paquete
  // `cors` copia en la respuesta los headers que el preflight pidió, y entonces
  // Authorization pasa sin problema. O sea que declarar la lista a medias es
  // PEOR que no declararla. Por eso este error aparece justo cuando alguien
  // "se puso a configurar CORS bien".
  app.use(cors({ origin: ORIGEN_DEL_FRONT, allowedHeaders: ['Content-Type'] }));
} else if (modo === 'estricto') {
  app.use(
    cors({
      origin: ORIGEN_DEL_FRONT,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      // Si se declara la lista de headers, Authorization TIENE que estar. Sin
      // él, el navegador bloquea todo request que lleve el token — comparar
      // con el modo 'sin-auth'.
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
}

app.use(express.json());

// ── Log de lo que llega, para proyectar en clase ──
// Lo interesante es ver aparecer los OPTIONS que nadie escribió: los manda el
// navegador solo, antes del request de verdad. Eso es el preflight.
app.use((req, res, next) => {
  const marca = req.method === 'OPTIONS' ? '  <-- PREFLIGHT' : '';
  console.log(`${req.method.padEnd(7)} ${req.path.padEnd(20)} origin: ${req.headers.origin ?? '(ninguno)'}${marca}`);
  next();
});

// ── Los endpoints ──

const productos = [
  { id: 1, nombre: 'Teclado', precio: 25000 },
  { id: 2, nombre: 'Mouse', precio: 15000 },
];

app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// Login de mentira: no hay usuarios ni contraseñas, devuelve un token y listo.
app.post('/api/auth/login', (req, res) => {
  const token = jwt.sign({ sub: '1', email: 'ana@dsw.com', rol: 'usuario' }, SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

// Ruta protegida. Es la que dispara el preflight desde el navegador, porque el
// request lleva el header Authorization.
app.post('/api/productos', (req, res) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Falta el token' });
    return;
  }

  try {
    jwt.verify(header.slice('Bearer '.length), SECRET);
  } catch {
    res.status(401).json({ error: 'Token inválido' });
    return;
  }

  const nuevo = { id: productos.length + 1, ...req.body };
  productos.push(nuevo);

  res.status(201).json(nuevo);
});

app.listen(3000, () => {
  console.log('─'.repeat(70));
  console.log(`API en http://localhost:3000   ·   CORS: ${modo.toUpperCase()}`);

  if (modo === 'apagado') {
    console.log('El front en :5173 va a fallar en todo. Es lo que se busca.');
  } else if (modo === 'abierto') {
    console.log("origin: '*' — anda, y no es lo que corresponde. Ver el README.");
  } else if (modo === 'sin-auth') {
    console.log(`Origen ${ORIGEN_DEL_FRONT} permitido, pero SIN el header Authorization:`);
    console.log('el GET va a andar y el POST con token no. Ese es el error de la clase.');
  } else {
    console.log(`Solo se acepta ${ORIGEN_DEL_FRONT}, con el header Authorization.`);
  }

  console.log('─'.repeat(70));
});
