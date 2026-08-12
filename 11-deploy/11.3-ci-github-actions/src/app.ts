import express from 'express';
import { aplicarDescuento, precioConIva } from './precios.js';

// Una API mínima, con lo justo para que el workflow tenga algo que buildear y
// que testear de punta a punta.

export const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ estado: 'ok' });
});

app.get('/api/precios/:precio', (req, res) => {
  const precio = Number(req.params.precio);

  if (!Number.isFinite(precio) || precio < 0) {
    res.status(400).json({ error: 'El precio tiene que ser un número positivo' });
    return;
  }

  res.json({
    precio,
    conIva: precioConIva(precio),
    conDescuento10: aplicarDescuento(precio, 10),
  });
});
