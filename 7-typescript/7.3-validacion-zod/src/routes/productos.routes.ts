import { Router } from 'express';
import { listar, crear } from '../controllers/productos.controller.js';
import { validar } from '../shared/validar.js';
import { productoNuevoSchema } from '../schemas/producto.schema.js';

export const productosRouter = Router();

productosRouter.get('/', listar);

// El middleware de validación va ANTES del controller: si el body no cumple el
// esquema, el request muere acá con un 400 y el controller nunca se entera.
productosRouter.post('/', validar(productoNuevoSchema), crear);
