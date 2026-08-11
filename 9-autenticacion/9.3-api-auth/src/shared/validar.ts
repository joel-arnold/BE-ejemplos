import type { Request, Response, NextFunction } from 'express';
import type { ZodTypeAny } from 'zod';

// Sin cambios respecto del 8.2.
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

    req.body = resultado.data;
    next();
  };
}
