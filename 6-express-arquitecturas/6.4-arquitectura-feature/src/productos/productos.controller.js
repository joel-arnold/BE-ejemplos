import * as service from './productos.service.js'

export async function listar(req, res, next) {
  try {
    const productos = await service.listarProductos()
    res.json(productos)
  } catch (err) {
    next(err)
  }
}

export async function crear(req, res, next) {
  try {
    const producto = await service.crearProducto(req.body)
    res.status(201).json(producto)
  } catch (err) {
    next(err)
  }
}
