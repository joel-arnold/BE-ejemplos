import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/productos.service.js';
import type { ProductoNuevo } from '../schemas/producto.schema.js';

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
    // req.body sigue siendo `any` para TypeScript, pero acá el `as` es de los
    // legítimos: sabemos algo que el compilador no puede saber, y es que el
    // middleware validar(productoNuevoSchema) ya corrió y dejó en req.body
    // exactamente lo que devolvió Zod. Sin ese middleware en la ruta, esta
    // afirmación sería falsa y volveríamos al problema del 7.2.
    const datos = req.body as ProductoNuevo;

    const producto = await service.crearProducto(datos);
    res.status(201).json(producto);
  } catch (err) {
    next(err);
  }
}
