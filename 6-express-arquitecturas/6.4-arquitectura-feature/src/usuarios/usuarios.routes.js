import { Router } from 'express'
import { listar, crear } from './usuarios.controller.js'

export const usuariosRouter = Router()

usuariosRouter.get('/', listar)
usuariosRouter.post('/', crear)
