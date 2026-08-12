import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/auth.service.js';
import type { Registro, Login } from '../schemas/auth.schema.js';

export async function registro(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const datos = req.body as Registro;

    const usuario = await service.registrar(datos);

    // `usuario` incluye passwordHash como propiedad, pero NO sale en el JSON:
    // la entidad la tiene marcada con hidden: true. Vale abrir la respuesta en
    // el .http y comprobarlo.
    res.status(201).json(usuario);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const datos = req.body as Login;

    const { token, usuario } = await service.login(datos);

    // El token va en el body de la respuesta. El cliente lo guarda y lo manda
    // en el header Authorization de cada request siguiente.
    //
    // La otra opción es mandarlo en una cookie httpOnly, que el navegador
    // guarda y adjunta solo. Es más seguro contra XSS —el JavaScript de la
    // página no puede leerla— y más incómodo con CORS y con clientes que no
    // son un navegador. La cátedra usa el header porque es lo que va a usar el
    // front de Angular y lo que se ve en cualquier tutorial; que existe la
    // alternativa, conviene saberlo.
    res.json({ token, usuario });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/yo — la ruta protegida más chiquita posible.
// No consulta la base: todo lo que devuelve salió del token que el middleware
// ya verificó. Sirve para que el front sepa quién está logueado y para
// demostrar en clase que req.usuario existe.
export function yo(req: Request, res: Response): void {
  res.json(req.usuario);
}

// GET /api/auth/usuarios — solo admin.
export async function listarUsuarios(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await service.listarUsuarios());
  } catch (err) {
    next(err);
  }
}
