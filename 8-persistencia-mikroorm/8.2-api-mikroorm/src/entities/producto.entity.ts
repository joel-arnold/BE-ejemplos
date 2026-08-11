import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/es';
import type { Opt } from '@mikro-orm/core';

// Esta entidad REEMPLAZA al archivo types/producto.ts del ejemplo 7.2 y a la
// mitad del schemas/producto.schema.ts del 7.3: `Producto` ahora es una clase
// real, con una tabla atrás.
//
// Lo que NO reemplaza es el esquema de Zod. Siguen haciendo falta los dos, y
// cada uno cubre una cosa distinta:
//   - La entidad describe cómo se GUARDA un producto (columnas, tipos, tamaños).
//   - El esquema de Zod describe qué se ACEPTA en el body de un request.
// Ver schemas/producto.schema.ts.

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

  // `Opt` marca la propiedad como no obligatoria al crear: ya tiene valor, así
  // que em.create() no la pide. El repository puede pasarle el body pelado.
  @Property()
  creadoEn: Opt<Date> = new Date();
}
