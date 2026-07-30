// El tipo del dominio: lo que viaja por todas las capas. Vive en un solo lugar
// y lo importan el repository, el service y (a través de ellos) el controller.

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

// El alta llega SIN id: lo asigna el repository. En vez de duplicar la
// interface, se deriva de ella. Si mañana Producto suma un campo,
// ProductoNuevo se actualiza solo.
export type ProductoNuevo = Omit<Producto, 'id'>;
