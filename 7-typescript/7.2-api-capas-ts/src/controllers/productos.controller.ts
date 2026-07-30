import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/productos.service.js';

// Habla HTTP y nada más. Los tipos de Express vienen del paquete
// @types/express: Express está escrito en JavaScript, así que sus tipos se
// instalan aparte (npm i -D @types/express).

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
    // ATENCIÓN: req.body es `any`. Express no puede saber qué te van a mandar,
    // así que TypeScript acepta pasárselo al service sin chequear NADA. Toda la
    // cadena está tipada y aun así entra basura: un POST con "precio": "15000"
    // responde 201. El chequeo en tiempo de ejecución es el ejemplo 7.3.
    const producto = await service.crearProducto(req.body);
    res.status(201).json(producto);
  } catch (err) {
    next(err); // lo captura el middleware de errores
  }
}
