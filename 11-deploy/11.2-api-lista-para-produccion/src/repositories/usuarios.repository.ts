import { orm } from '../db.js';
import { Usuario, type Rol } from '../entities/usuario.entity.js';

// El repository de usuarios, con la misma forma que el de productos de la
// unidad 8: solo sabe leer y escribir filas. No hashea, no valida, no decide
// nada. Todo eso es del service.

export async function findByEmail(email: string): Promise<Usuario | null> {
  return orm.em.findOne(Usuario, { email });
}

export async function findById(id: number): Promise<Usuario | null> {
  return orm.em.findOne(Usuario, { id });
}

export async function findAll(): Promise<Usuario[]> {
  return orm.em.findAll(Usuario, { orderBy: { id: 'asc' } });
}

// Recibe el hash ya calculado, no la contraseña. La firma es documentación:
// deja claro que hashear no es responsabilidad de esta capa y hace imposible
// pasarle una contraseña en texto plano sin darse cuenta.
export async function guardar(email: string, passwordHash: string, rol: Rol): Promise<Usuario> {
  const usuario = orm.em.create(Usuario, { email, passwordHash, rol });
  await orm.em.flush();
  return usuario;
}
