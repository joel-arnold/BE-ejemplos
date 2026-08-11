import { Router } from 'express';
import { crearProductosController } from '../controllers/productos.controller.js';
import { autenticar } from '../middlewares/autenticar.js';
import type { ProductosService } from '../services/productos.service.js';

export function crearProductosRouter(service: ProductosService): Router {
  const controller = crearProductosController(service);
  const router = Router();

  // Listar es público; crear y borrar piden token. Esta línea de cada ruta es
  // una regla del sistema, y el 10.4 la testea.
  router.get('/', controller.listar);
  router.post('/', autenticar, controller.crear);
  router.delete('/:id', autenticar, controller.eliminar);

  return router;
}
