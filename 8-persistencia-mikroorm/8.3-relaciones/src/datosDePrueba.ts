import type { MikroORM } from '@mikro-orm/mysql';
import { Producto } from './entities/producto.entity.js';
import { Categoria } from './entities/categoria.entity.js';
import { Etiqueta } from './entities/etiqueta.entity.js';

// Datos de prueba compartidos por los tres ejemplos de esta carpeta.
// Deja la base recién creada y con tres categorías, seis productos y etiquetas.
export async function sembrar(orm: MikroORM): Promise<void> {
  await orm.schema.refresh();

  const em = orm.em.fork();

  const perifericos = em.create(Categoria, { nombre: 'Periféricos' });
  const monitores = em.create(Categoria, { nombre: 'Monitores' });
  const audio = em.create(Categoria, { nombre: 'Audio' });

  const oferta = em.create(Etiqueta, { nombre: 'oferta' });
  const gamer = em.create(Etiqueta, { nombre: 'gamer' });
  const inalambrico = em.create(Etiqueta, { nombre: 'inalámbrico' });

  em.create(Producto, { nombre: 'Teclado', precio: 25000, categoria: perifericos, etiquetas: [gamer] });
  em.create(Producto, { nombre: 'Mouse', precio: 15000, categoria: perifericos, etiquetas: [gamer, inalambrico] });
  em.create(Producto, { nombre: 'Webcam', precio: 45000, categoria: perifericos, etiquetas: [] });
  em.create(Producto, { nombre: 'Monitor 24', precio: 210000, categoria: monitores, etiquetas: [oferta] });
  em.create(Producto, { nombre: 'Monitor 27', precio: 320000, categoria: monitores, etiquetas: [] });
  em.create(Producto, { nombre: 'Parlantes', precio: 38000, categoria: audio, etiquetas: [oferta, inalambrico] });

  // Un solo flush para todo: el ORM ordena los INSERT solo (primero las
  // categorías y etiquetas, después los productos que las referencian, y al
  // final las filas de la tabla intermedia).
  await em.flush();
}
