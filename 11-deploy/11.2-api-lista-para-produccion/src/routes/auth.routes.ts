import { Router } from 'express';
import { registro, login, yo, listarUsuarios } from '../controllers/auth.controller.js';
import { validar } from '../shared/validar.js';
import { autenticar } from '../middlewares/autenticar.js';
import { requiereRol } from '../middlewares/autorizar.js';
import { registroSchema, loginSchema } from '../schemas/auth.schema.js';

export const authRouter = Router();

// Las dos rutas de entrada son PÚBLICAS por necesidad: si registrarse o
// loguearse requiriera token, no habría forma de conseguir el primero.
authRouter.post('/registro', validar(registroSchema), registro);
authRouter.post('/login', validar(loginSchema), login);

// Autenticada: hay que estar logueado, no importa el rol.
authRouter.get('/yo', autenticar, yo);

// Autenticada Y autorizada. Los dos middlewares en orden, y el orden importa:
// requiereRol lee req.usuario, que lo pone autenticar.
authRouter.get('/usuarios', autenticar, requiereRol('admin'), listarUsuarios);
