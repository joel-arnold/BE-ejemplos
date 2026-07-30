import express from 'express';
import { productosRouter } from './routes/productos.routes.js';
import { errorHandler } from './shared/errorHandler.js';

const app = express();

app.use(express.json());

app.use('/api/productos', productosRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000/');
});
