import * as service from '../services/productos.service.js'

// Habla HTTP y nada más: lee el req, llama al service y arma la respuesta
// (status + JSON). No sabe cómo se guardan los datos ni aplica reglas de
// negocio. Si algo falla, delega en el middleware de errores con next(err).

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
    next(err) // lo captura el middleware de errores
  }
}
