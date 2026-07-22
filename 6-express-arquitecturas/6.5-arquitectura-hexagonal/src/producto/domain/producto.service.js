import { ValidationError } from '../../shared/errors.js'

// CASO DE USO: la lógica de negocio depende del PUERTO, no de una
// implementación concreta. Recibe el repositorio por inyección de dependencias
// (en el constructor), así que no sabe si detrás hay un array, MongoDB o un
// mock de test.
export class ProductoService {
  constructor(repository) {
    this.repository = repository
  }

  async listar() {
    return this.repository.findAll()
  }

  async crear(datos) {
    if (!datos.nombre || datos.precio == null || datos.precio <= 0) {
      throw new ValidationError('Datos inválidos')
    }
    return this.repository.guardar(datos)
  }
}
