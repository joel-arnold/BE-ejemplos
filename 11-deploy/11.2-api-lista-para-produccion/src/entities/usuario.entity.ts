import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/es';
import type { Opt } from '@mikro-orm/core';

// Los roles del sistema. Dos alcanzan para mostrar la idea; en un sistema real
// suelen ser más, y a partir de cierto punto conviene una tabla de roles y
// permisos en vez de un string.
export type Rol = 'usuario' | 'admin';

@Entity()
export class Usuario {
  @PrimaryKey()
  id!: number;

  // unique: true no es un detalle de comodidad. El email es lo que identifica
  // al usuario al hacer login: si hubiera dos filas con el mismo email, no
  // habría forma de saber contra cuál verificar la contraseña.
  @Property({ length: 120, unique: true })
  email!: string;

  // ── LA COLUMNA MÁS IMPORTANTE DE LA UNIDAD ──
  //
  // Se llama passwordHash y NO password. El nombre es documentación: el que
  // lea la entidad dentro de seis meses tiene que ver de una que acá no hay
  // una contraseña.
  //
  // length: 60 porque eso mide exactamente un hash de bcrypt — versión, cost,
  // salt y hash, todo en un string (ejemplo 9.1.2).
  //
  // hidden: true hace que MikroORM la SAQUE al serializar la entidad a JSON.
  // Sin eso, un `res.json(usuario)` en cualquier controller manda el hash por
  // la red. No es catastrófico (es un hash), pero es información que el
  // cliente no necesita y que sirve para atacar offline. La regla es no
  // mandar nunca lo que no hace falta.
  @Property({ length: 60, hidden: true })
  passwordHash!: string;

  // El type explícito es porque `Rol` es una unión de literales y el
  // metadataProvider no la puede mapear sola. En la base es un varchar.
  @Property({ type: 'string', length: 20 })
  rol: Opt<Rol> = 'usuario';

  @Property()
  creadoEn: Opt<Date> = new Date();
}

// Lo que NO está en esta clase, y es tan importante como lo que sí:
//
//   - No hay un campo `password`. En ningún momento, en ninguna capa, se
//     guarda la contraseña original.
//   - No hay un método verificarPassword(). Eso vive en el service, junto con
//     el resto de la lógica de autenticación: la entidad describe cómo se
//     guarda un usuario, no cómo se autentica (Data Mapper, unidad 8).
