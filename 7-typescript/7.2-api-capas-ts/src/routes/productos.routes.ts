import { Router } from 'express';
import { listar, crear } from '../controllers/productos.controller.js';

// Mapean método + URL a un controller. Casi no cambian respecto de la versión
// en JavaScript: solo que el import lleva la extensión .js aunque el archivo
// sea .ts (así lo resuelve Node cuando el código ya está compilado).

export const productosRouter = Router();

productosRouter.get('/', listar);
productosRouter.post('/', crear);
