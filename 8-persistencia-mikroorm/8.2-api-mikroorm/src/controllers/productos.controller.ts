import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/productos.service.js';
import type { ProductoNuevo } from '../schemas/producto.schema.js';

// Idéntico al controller del 7.3. Vale mirar lo que devuelve res.json():
// las entidades que salen del ORM se serializan a JSON como objetos comunes,
// sin que haya que convertirlas a mano.

export async function listar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const productos = await service.listarProductos();
    res.json(productos);
  } catch (err) {
    next(err);
  }
}

export async function crear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // El `as` sigue siendo legítimo: el middleware validar(productoNuevoSchema)
    // ya corrió y dejó en req.body lo que devolvió Zod.
    const datos = req.body as ProductoNuevo;

    const producto = await service.crearProducto(datos);
    res.status(201).json(producto);
  } catch (err) {
    next(err);
  }
}
