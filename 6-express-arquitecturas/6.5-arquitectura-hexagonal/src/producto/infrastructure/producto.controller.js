// ADAPTADOR DE ENTRADA: traduce HTTP hacia el caso de uso y la respuesta de
// vuelta. Recibe el service ya construido (con su repositorio inyectado).
// Los métodos son arrow functions para conservar el `this` al pasarlos como
// handlers al router.
export class ProductoController {
  constructor(service) {
    this.service = service
  }

  listar = async (req, res, next) => {
    try {
      res.json(await this.service.listar())
    } catch (err) {
      next(err)
    }
  }

  crear = async (req, res, next) => {
    try {
      const producto = await this.service.crear(req.body)
      res.status(201).json(producto)
    } catch (err) {
      next(err)
    }
  }
}
