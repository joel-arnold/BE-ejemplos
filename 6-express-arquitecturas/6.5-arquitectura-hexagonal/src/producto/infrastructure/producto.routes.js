import { Router } from 'express'
import { ProductoService } from '../domain/producto.service.js'
import { ProductoController } from './producto.controller.js'
import { MemoryProductoRepository } from './producto.memory.repository.js'

// COMPOSICIÓN: acá se "enchufan" los adaptadores concretos al dominio. Es el
// único lugar que conoce a la vez el puerto y su implementación. Para pasar a
// MongoDB se cambia solo la primera línea (el adaptador de salida).
const repository = new MemoryProductoRepository()
const service = new ProductoService(repository)
const controller = new ProductoController(service)

export const productoRouter = Router()

productoRouter.get('/', controller.listar)
productoRouter.post('/', controller.crear)
