import * as service from './usuarios.service.js'

export async function listar(req, res, next) {
  try {
    const usuarios = await service.listarUsuarios()
    res.json(usuarios)
  } catch (err) {
    next(err)
  }
}

export async function crear(req, res, next) {
  try {
    const usuario = await service.crearUsuario(req.body)
    res.status(201).json(usuario)
  } catch (err) {
    next(err)
  }
}
