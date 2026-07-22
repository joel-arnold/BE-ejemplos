import { Router } from 'express'
import { listar, crear } from './productos.controller.js'

export const productosRouter = Router()

productosRouter.get('/', listar)
productosRouter.post('/', crear)
