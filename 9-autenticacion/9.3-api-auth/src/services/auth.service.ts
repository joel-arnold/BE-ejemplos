import bcrypt from 'bcryptjs';
import * as repo from '../repositories/usuarios.repository.js';
import { emitirToken } from '../shared/jwt.js';
import { UnauthorizedError, ValidationError } from '../shared/errors.js';
import type { Usuario } from '../entities/usuario.entity.js';
import type { Registro, Login } from '../schemas/auth.schema.js';

// El cost factor de bcrypt. En un proyecto real esto también sería
// configuración, para poder subirlo sin tocar código (ejemplo 9.1.2).
const COST = 10;

// ============================================================================
// REGISTRO
// ============================================================================

export async function registrar(datos: Registro): Promise<Usuario> {
  const existente = await repo.findByEmail(datos.email);

  if (existente) {
    // Acá hay una tensión real y vale nombrarla: este mensaje le confirma a
    // cualquiera que ese email está registrado (enumeración de usuarios). La
    // alternativa —contestar 201 siempre y avisar por mail— es más segura y
    // bastante más de armar. Para el TP, este mensaje está bien; en un sistema
    // con usuarios reales, la decisión se piensa.
    throw new ValidationError('Ya existe un usuario con ese email');
  }

  // El único lugar de toda la aplicación donde se hashea. La contraseña en
  // texto plano existe dentro de esta función y no sale de acá: no se loguea,
  // no se guarda, no se devuelve.
  const passwordHash = await bcrypt.hash(datos.password, COST);

  // Todos los registros públicos crean usuarios comunes. El rol NO se acepta
  // del body: si se aceptara, cualquiera se registraría como admin mandando
  // {"rol": "admin"}. Un admin se crea a mano en la base o con un script de
  // seed.
  return repo.guardar(datos.email, passwordHash, 'usuario');
}

// ============================================================================
// LOGIN
// ============================================================================

export async function login(datos: Login): Promise<{ token: string; usuario: Usuario }> {
  const usuario = await repo.findByEmail(datos.email);

  // Un solo mensaje para los dos casos posibles —email inexistente y
  // contraseña equivocada— para no revelar qué emails están registrados
  // (ejemplo 9.1.3, nivel 2).
  //
  // Y se compara SIEMPRE, incluso si el usuario no existe, contra un hash
  // descartable: si cortáramos antes, la respuesta llegaría mucho más rápido
  // cuando el email no existe y el tiempo filtraría lo mismo que el mensaje.
  const hashAComparar = usuario?.passwordHash ?? '$2b$10$invalidoinvalidoinvalidoinvalidoinvalidoinvalidoinvalidoin';
  const coincide = await bcrypt.compare(datos.password, hashAComparar);

  if (!usuario || !coincide) {
    throw new UnauthorizedError('Credenciales inválidas');
  }

  // Recién acá se emite el token: es el ÚNICO momento en que el servidor ve la
  // contraseña. A partir de ahora, el cliente presenta el token y nunca más la
  // contraseña.
  const token = emitirToken({
    sub: String(usuario.id),
    email: usuario.email,
    rol: usuario.rol,
  });

  return { token, usuario };
}

export async function listarUsuarios(): Promise<Usuario[]> {
  return repo.findAll();
}

// ============================================================================
// LO QUE NO ESTÁ ACÁ
// ============================================================================
// No hay ninguna función "cerrarSesion()". Con JWT no hay nada que cerrar del
// lado del servidor: no guardó nada. El logout es que el cliente borre el
// token que tiene guardado.
//
// La consecuencia incómoda: un token copiado antes del logout sigue siendo
// válido hasta que vence. Eso NO se arregla con más código acá; se arregla
// con expiraciones cortas, o cambiando de enfoque (sesiones en el servidor, o
// una lista de tokens revocados — que es volver a tener estado).
//
// Es el precio de que la API no guarde nada, que es también lo que la hace
// fácil de escalar a varias instancias.
