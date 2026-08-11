import { Router } from 'express';
import { listar, crear } from '../controllers/productos.controller.js';
import { validar } from '../shared/validar.js';
import { productoNuevoSchema } from '../schemas/producto.schema.js';

// Sin cambios respecto del 7.3.
export const productosRouter = Router();

productosRouter.get('/', listar);
productosRouter.post('/', validar(productoNuevoSchema), crear);
