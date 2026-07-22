import * as repo from './usuarios.repository.js'
import { ValidationError } from '../shared/errors.js'

export async function listarUsuarios() {
  return repo.findAll()
}

export async function crearUsuario(datos) {
  if (!datos.nombre || !datos.email) {
    throw new ValidationError('Datos inválidos')
  }
  return repo.guardar(datos)
}
