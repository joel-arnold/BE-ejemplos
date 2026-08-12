import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/productos.service.js';
import { UnauthorizedError } from '../shared/errors.js';
import type { ProductoNuevo } from '../schemas/producto.schema.js';

export async function listar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await service.listarProductos());
  } catch (err) {
    next(err);
  }
}

export async function crear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const datos = req.body as ProductoNuevo;

    // req.usuario es opcional en el tipo (ver types/express.d.ts), así que el
    // compilador obliga a contemplar el caso undefined. En esta ruta no puede
    // pasar —el middleware `autenticar` corre antes— pero el chequeo es la
    // red que avisa si alguien saca el middleware de la ruta.
    if (!req.usuario) {
      throw new UnauthorizedError('Falta el token de autenticación');
    }

    const producto = await service.crearProducto(datos, req.usuario);

    res.status(201).json(producto);
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.usuario) {
      throw new UnauthorizedError('Falta el token de autenticación');
    }

    // El id viene de la URL y siempre es string. Number() lo convierte; si la
    // URL trae cualquier cosa, sale NaN y el ORM no va a encontrar nada — que
    // termina en el 404 correcto.
    await service.eliminarProducto(Number(req.params.id), req.usuario);

    // 204: se hizo, y no hay nada que devolver.
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
