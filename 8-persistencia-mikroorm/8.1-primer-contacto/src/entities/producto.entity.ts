// ============================================================================
// LA ENTIDAD - una clase de TypeScript con decoradores
// ============================================================================
// Esto es exactamente la clase de la unidad 7 (7.1.4-clases.ts) más unas
// anotaciones que le cuentan al ORM cómo mapear cada propiedad a una columna.
//
// La entidad NO extiende de nada ni hereda de una clase base del ORM: es una
// clase común. Eso es lo que significa que MikroORM sea un ORM de tipo
// Data Mapper — el objeto no sabe guardarse a sí mismo.
// ============================================================================

import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/es';
import type { Opt } from '@mikro-orm/core';

@Entity()
export class Producto {
  // @PrimaryKey marca la clave primaria. Con `number`, MySQL la crea como
  // int unsigned auto_increment: la asigna la base, no nosotros.
  @PrimaryKey()
  id!: number;

  // El `!` es de TypeScript, no de MikroORM: le avisa al compilador "esta
  // propiedad se va a inicializar, aunque no la asigne en un constructor".
  // Quien la asigna es el ORM al hidratar el objeto desde la base.
  @Property({ length: 100 })
  nombre!: string;

  @Property()
  precio!: number;

  // nullable: true => la columna admite NULL, y el tipo TS lleva `?`.
  // Las dos cosas tienen que decir lo mismo, o el modelo miente.
  @Property({ nullable: true })
  descripcion?: string;

  // Sin `!` y con valor inicial: es una propiedad común de TypeScript con un
  // inicializador. Al construir la entidad la fecha queda puesta, y al hidratar
  // desde la base el ORM la pisa con el valor de la columna.
  //
  // `Opt<Date>` (de "optional") le avisa al ORM que esta propiedad NO hay que
  // pasarla al crear, porque ya tiene valor. Sin eso, em.create() la exigiría:
  // el tipo de create() se arma con las propiedades obligatorias de la entidad.
  @Property()
  creadoEn: Opt<Date> = new Date();
}
