import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/decorators/es';
import { Collection } from '@mikro-orm/core';
import { Producto } from './producto.entity.js';

@Entity()
export class Categoria {
  @PrimaryKey()
  id!: number;

  @Property({ length: 60, unique: true })
  nombre!: string;

  // ── El lado INVERSO de la relación ──
  // No genera ninguna columna: la categoría no guarda a sus productos. Es la
  // misma clave foránea de Producto.categoria, leída al revés.
  //
  // El segundo argumento (p) => p.categoria dice CUÁL propiedad del otro lado
  // es la dueña. Sin eso, el ORM no sabría por qué columna unir.
  @OneToMany(() => Producto, (p) => p.categoria)
  productos = new Collection<Producto>(this);
}

// Una Collection NO es un array: es un array que sabe si está cargado o no.
// Por defecto viene vacía y sin inicializar; los items se traen con populate o
// con .init(). Eso evita que pedir una categoría arrastre toda la tabla de
// productos sin que nadie lo haya pedido.
