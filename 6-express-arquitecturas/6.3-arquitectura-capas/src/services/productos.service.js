import * as repo from '../repositories/productos.repository.js'
import { ValidationError } from '../shared/errors.js'

// La lógica de negocio: reglas y validaciones de dominio. No conoce Express ni
// la base de datos; recibe y devuelve datos puros. Se puede testear llamando a
// estas funciones directo, sin levantar el servidor.

export async function listarProductos() {
  return repo.findAll()
}

export async function crearProducto(datos) {
  if (!datos.nombre || datos.precio == null || datos.precio <= 0) {
    throw new ValidationError('Datos inválidos')
  }
  return repo.guardar(datos)
}
