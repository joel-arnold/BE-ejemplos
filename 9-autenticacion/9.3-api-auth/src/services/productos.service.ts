import * as repo from '../repositories/productos.repository.js';
import * as usuariosRepo from '../repositories/usuarios.repository.js';
import { ForbiddenError, ValidationError } from '../shared/errors.js';
import { Producto } from '../entities/producto.entity.js';
import type { ProductoNuevo } from '../schemas/producto.schema.js';
import type { PayloadToken } from '../shared/jwt.js';

export async function listarProductos(): Promise<Producto[]> {
  return repo.findAll();
}

// ============================================================================
// CREAR: el dueño sale del token, no del body
// ============================================================================

export async function crearProducto(datos: ProductoNuevo, autor: PayloadToken): Promise<Producto> {
  const existente = await repo.findByNombre(datos.nombre);

  if (existente) {
    throw new ValidationError(`Ya existe un producto llamado "${datos.nombre}"`);
  }

  // El id viene del token, que el middleware ya verificó. Es la diferencia
  // entre "el cliente dice que es el usuario 7" y "el servidor firmó que es el
  // usuario 7".
  const autorEnBase = await usuariosRepo.findById(Number(autor.sub));

  if (!autorEnBase) {
    // El token es válido pero el usuario ya no está en la base: se borró la
    // cuenta después de emitirlo. Es el caso raro que recuerda que un JWT es
    // una FOTO del momento en que se emitió, no un espejo del estado actual.
    throw new ForbiddenError('El usuario del token ya no existe');
  }

  return repo.guardar(datos, autorEnBase);
}

// ============================================================================
// ELIMINAR: la autorización que NO entra en un middleware
// ============================================================================
// La regla es "solo el que lo creó, o un admin". Para evaluarla hay que saber
// de quién es el producto, y eso está en la base — así que no se puede
// resolver antes de buscarlo. Por eso vive acá y no en middlewares/autorizar.ts
// (está explicado en ese archivo).
//
// Fijate el ORDEN de los chequeos, que no es casual:
//   1. ¿Existe?           -> si no, 404 (lo tira findByIdOrFail)
//   2. ¿Tenés permiso?    -> si no, 403
//   3. Borrar
// ============================================================================

export async function eliminarProducto(id: number, quienPide: PayloadToken): Promise<void> {
  const producto = await repo.findByIdOrFail(id);

  const esAdmin = quienPide.rol === 'admin';
  const esDueno = producto.creadoPor.id === Number(quienPide.sub);

  if (!esAdmin && !esDueno) {
    throw new ForbiddenError('Solo podés borrar los productos que creaste');
  }

  await repo.eliminar(producto);
}

// ============================================================================
// UN DETALLE QUE SE LES VA A PASAR EN EL TP
// ============================================================================
// El orden de arriba tiene una fuga chiquita: pedir un producto que no existe
// devuelve 404 y pedir uno ajeno devuelve 403. Con eso, cualquiera puede
// averiguar QUÉ IDS EXISTEN aunque no pueda tocarlos.
//
// A veces no importa (acá no: los productos se listan públicamente). Cuando
// importa —historias clínicas, facturas— la respuesta correcta es devolver 404
// también en el caso del 403: "si no es tuyo, para vos no existe".
//
// La decisión es de producto, no técnica. Lo importante es tomarla a
// conciencia y no que salga sola del orden en que se escribieron los ifs.
