import { Router } from 'express'
import { listar, crear } from '../controllers/productos.controller.js'

// Mapean método + URL a un controller. No tienen lógica: son la tabla de
// contenidos de la API.
export const productosRouter = Router()

productosRouter.get('/', listar)
productosRouter.post('/', crear)
