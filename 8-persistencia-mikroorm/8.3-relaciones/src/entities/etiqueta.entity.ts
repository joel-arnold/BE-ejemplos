import { Entity, PrimaryKey, Property, ManyToMany } from '@mikro-orm/decorators/es';
import { Collection } from '@mikro-orm/core';
import { Producto } from './producto.entity.js';

@Entity()
export class Etiqueta {
  @PrimaryKey()
  id!: number;

  @Property({ length: 40, unique: true })
  nombre!: string;

  // Lado inverso: `mappedBy` apunta a la propiedad dueña del otro lado.
  // No genera columnas ni tabla; la tabla intermedia la declara Producto.
  @ManyToMany(() => Producto, (p) => p.etiquetas)
  productos = new Collection<Producto>(this);
}
