import * as repo from './productos.repository.js'
import { ValidationError } from '../shared/errors.js'

export async function listarProductos() {
  return repo.findAll()
}

export async function crearProducto(datos) {
  if (!datos.nombre || datos.precio == null || datos.precio <= 0) {
    throw new ValidationError('Datos inválidos')
  }
  return repo.guardar(datos)
}
