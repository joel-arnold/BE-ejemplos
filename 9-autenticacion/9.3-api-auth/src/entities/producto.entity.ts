import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/es';
import type { Opt } from '@mikro-orm/core';
import { Usuario } from './usuario.entity.js';

// La entidad del 8.2 con una sola cosa nueva: quién creó el producto.
//
// Sin este campo no habría autorización de verdad para mostrar. "Solo el que
// lo creó puede borrarlo" es una regla que necesita saber DE QUIÉN es el
// recurso — y eso es un dato de la base, no del token.

@Entity()
export class Producto {
  @PrimaryKey()
  id!: number;

  @Property({ length: 100, unique: true })
  nombre!: string;

  @Property()
  precio!: number;

  @Property({ nullable: true })
  descripcion?: string;

  // Uno a muchos: un usuario crea muchos productos. La FK va del lado
  // "muchos", así que la columna `creado_por_id` vive en la tabla producto
  // (unidad 8, bloque de relaciones).
  //
  // No cargamos la relación inversa (Usuario.productos) porque nadie la
  // necesita todavía: no hay ningún endpoint que liste los productos de un
  // usuario. Agregarla "por las dudas" es trabajo que el ORM hace de más.
  @ManyToOne(() => Usuario)
  creadoPor!: Usuario;

  @Property()
  creadoEn: Opt<Date> = new Date();
}
