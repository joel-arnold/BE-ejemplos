import type { RequestHandler } from 'express';
import type { ProductosService } from '../services/productos.service.js';

// El controller también recibe su dependencia por parámetro. Su único trabajo
// sigue siendo el de la unidad 6: traducir entre HTTP y el service.

export function crearProductosController(service: ProductosService) {
  const listar: RequestHandler = async (_req, res, next) => {
    try {
      res.json(await service.listar());
    } catch (error) {
      next(error);
    }
  };

  const crear: RequestHandler = async (req, res, next) => {
    try {
      const creado = await service.crear(req.body, req.usuario!);
      res.status(201).json(creado);
    } catch (error) {
      next(error);
    }
  };

  const eliminar: RequestHandler = async (req, res, next) => {
    try {
      await service.eliminar(Number(req.params.id), req.usuario!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  return { listar, crear, eliminar };
}
