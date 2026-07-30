import type { Request, Response, NextFunction } from 'express';
import type { ZodTypeAny } from 'zod';

// Validar dentro de cada controller repite código en cada endpoint. Para lo que
// se repite ya teníamos respuesta desde la unidad de arquitecturas: middleware.
//
// `validar` recibe un esquema y DEVUELVE un middleware: una función de orden
// superior como las de la unidad de funciones (ejemplo 2.8), pero tipada.
export function validar(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalle: resultado.error.issues.map((issue) => ({
          campo: issue.path.join('.'),
          mensaje: issue.message,
        })),
      });
    }

    // El body que sigue viaje es el que devolvió Zod: parseado y sin las
    // propiedades de más que hayan mandado.
    req.body = resultado.data;
    next();
  };
}
