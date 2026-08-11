import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/es';
import type { Opt } from '@mikro-orm/core';

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

  @Property()
  creadoEn: Opt<Date> = new Date();

  // ── Esta propiedad llegó DESPUÉS ──
  // Cuando se agregó, la tabla ya existía en producción con datos adentro. Por
  // eso la migración que la agrega tiene un `default 0`: sin eso, la columna
  // `not null` no se puede agregar a una tabla que ya tiene filas.
  //
  // Ese razonamiento es el que schema.update() no puede hacer por vos, y es la
  // razón de ser de las migraciones.
  @Property({ default: 0 })
  stock!: number;
}
