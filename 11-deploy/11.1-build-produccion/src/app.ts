import express from 'express';

// ============================================================================
// LA APP, SEPARADA DEL SERVIDOR
// ============================================================================
// Este archivo arma la aplicación y la exporta. NO llama a listen().
//
// Es la misma separación del ejemplo 10.4, y ahora cobra por segunda vez: en
// la unidad 10 servía para que supertest levantara la app sin ocupar un
// puerto, y acá sirve para que el arranque (con su chequeo de configuración,
// su conexión a la base y su manejo de señales) viva en un archivo aparte.
//
// Una app que se auto-arranca al importarla es imposible de testear e
// incómoda de deployar.
// ============================================================================

export const app = express();

app.use(express.json());

// ── Datos de mentira, para que el ejemplo no necesite nada ──────────────────
const productos = [
  { id: 1, nombre: 'Mate', precio: 5000 },
  { id: 2, nombre: 'Bombilla', precio: 2500 },
];

// ============================================================================
// EL HEALTHCHECK
// ============================================================================
// Una ruta que no hace nada y contesta 200. Parece de adorno y no lo es: es
// cómo el servidor de hosting se entera de si la aplicación está viva.
//
// Render, Railway, Fly y cualquier otro le pegan cada pocos segundos. Si deja
// de contestar, dan la instancia por muerta y la reinician. Sin healthcheck,
// la plataforma solo sabe que el proceso no se cayó — que no es lo mismo que
// que la API esté respondiendo.
//
// Tres reglas:
//   1. Que sea BARATA. Si consulta la base, un pico de carga hace que el
//      healthcheck tarde, la plataforma crea que moriste y te reinicie justo
//      cuando más tráfico tenías.
//   2. Que NO pida token. El que pregunta es un robot sin credenciales.
//   3. Que no revele nada. Ni versiones de librerías, ni rutas internas.
// ============================================================================
app.get('/health', (req, res) => {
  res.json({ estado: 'ok', ambiente: process.env.NODE_ENV ?? 'development' });
});

app.get('/api/productos', (req, res) => {
  res.json(productos);
});

app.get('/api/productos/:id', (req, res) => {
  const producto = productos.find((p) => p.id === Number(req.params.id));

  if (!producto) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  res.json(producto);
});
