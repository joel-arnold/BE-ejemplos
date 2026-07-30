// ============================================================================
// YA MIGRADO: el primer archivo que pasó a .ts
// ============================================================================
// La migración se hace de a un archivo, empezando por las HOJAS del árbol (el
// repository, los helpers) y subiendo hacia el controller. Las hojas no
// dependen de nadie, así que migrarlas no arrastra medio proyecto.
// ============================================================================

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

const productos: Producto[] = [
  { id: 1, nombre: 'Teclado', precio: 25000 },
  { id: 2, nombre: 'Mouse', precio: 15000 },
];

export async function findAll(): Promise<Producto[]> {
  return productos;
}

export async function findById(id: number): Promise<Producto | undefined> {
  return productos.find((p) => p.id === id);
}
