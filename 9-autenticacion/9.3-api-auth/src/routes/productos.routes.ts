import { Router } from 'express';
import { listar, crear, eliminar } from '../controllers/productos.controller.js';
import { validar } from '../shared/validar.js';
import { autenticar } from '../middlewares/autenticar.js';
import { productoNuevoSchema } from '../schemas/producto.schema.js';

// ============================================================================
// LAS RUTAS SON EL MAPA DE PERMISOS DE LA API
// ============================================================================
// Leyendo estas tres líneas se sabe quién puede hacer qué. Esa legibilidad es
// el argumento más fuerte para poner la autenticación acá y no adentro de cada
// controller: un permiso olvidado se ve como una línea que falta.
// ============================================================================

export const productosRouter = Router();

// Público. No todo lo que está en una API tiene que estar protegido: el
// catálogo de productos se ve sin cuenta, como en cualquier tienda.
productosRouter.get('/', listar);

// Autenticada. Hace falta estar logueado; no importa quién seas.
productosRouter.post('/', autenticar, validar(productoNuevoSchema), crear);

// Autenticada, y con una regla de autorización que NO está acá: "solo el dueño
// o un admin". Esa vive en el service, porque necesita ir a la base a ver de
// quién es el producto (ver middlewares/autorizar.ts).
productosRouter.delete('/:id', autenticar, eliminar);

// El orden dentro de cada línea también cuenta: autenticar antes que validar.
// Si un anónimo manda un body inválido, la respuesta correcta es 401 y no 400
// — no tiene por qué enterarse de cómo es el formato de una ruta que no puede
// usar.
