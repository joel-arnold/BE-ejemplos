// PUERTO: el contrato que el dominio define ("necesito algo que guarde
// productos"), sin decir cómo. En JS lo expresamos como una clase base
// abstracta; la infraestructura la extiende e implementa estos métodos. Así se
// invierte la dependencia: el dominio depende de esta abstracción, no de una
// base de datos concreta.
export class ProductoRepository {
  async findAll() {
    throw new Error('No implementado')
  }

  async guardar(datos) {
    throw new Error('No implementado')
  }
}
