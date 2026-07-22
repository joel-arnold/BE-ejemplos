import { ProductoRepository } from '../domain/producto.repository.js'

// ADAPTADOR DE SALIDA: una implementación concreta del puerto (extiende la clase
// base). Cambiar esto por un MongoProductoRepository no toca ni el dominio ni el
// controller: solo hay que enchufar el nuevo adaptador en la composición
// (producto.routes.js).
export class MemoryProductoRepository extends ProductoRepository {
  productos = [{ id: 1, nombre: 'Teclado', precio: 25000 }]

  async findAll() {
    return this.productos
  }

  async guardar(datos) {
    const nuevo = { id: this.productos.length + 1, ...datos }
    this.productos.push(nuevo)
    return nuevo
  }
}
