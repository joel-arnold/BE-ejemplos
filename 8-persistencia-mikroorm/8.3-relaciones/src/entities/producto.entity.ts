import { Entity, PrimaryKey, Property, ManyToOne, ManyToMany } from '@mikro-orm/decorators/es';
import { Collection } from '@mikro-orm/core';
import { Categoria } from './categoria.entity.js';
import { Etiqueta } from './etiqueta.entity.js';

@Entity()
export class Producto {
  @PrimaryKey()
  id!: number;

  @Property({ length: 100 })
  nombre!: string;

  @Property()
  precio!: number;

  // ── El lado DUEÑO de la relación ──
  // Este es el que genera la columna: `categoria_id int unsigned not null`,
  // con su foreign key y su índice. Regla para no perderse: en un uno a muchos,
  // la clave foránea vive siempre del lado "muchos".
  //
  // En TypeScript la propiedad es del tipo Categoria, no `number`. Se trabaja
  // con el objeto, no con el id — de eso se trata el mapeo objeto-relacional.
  @ManyToOne(() => Categoria)
  categoria!: Categoria;

  // ── Muchos a muchos ──
  // El lado dueño de un ManyToMany es el que declara la tabla intermedia. El
  // ORM la crea solo: producto_etiquetas(producto_id, etiqueta_id).
  @ManyToMany(() => Etiqueta, (e) => e.productos, { owner: true })
  etiquetas = new Collection<Etiqueta>(this);
}
