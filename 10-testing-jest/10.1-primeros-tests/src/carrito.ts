// ============================================================================
// OBJETOS Y ARRAYS — donde aparece el matcher que más confunde
// ============================================================================

export type Item = {
  nombre: string;
  precio: number;
  cantidad: number;
};

export function calcularTotal(items: Item[]): number {
  return items.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

// Devuelve un carrito NUEVO en vez de modificar el que recibe. Esto no es
// capricho de estilo: una función que no muta lo que recibe es una función que
// se testea sin preguntarse en qué estado quedó todo lo demás.
// Es la contracara del paso por compartición de la unidad 4.
export function agregarItem(carrito: Item[], nuevo: Item): Item[] {
  const existente = carrito.find((item) => item.nombre === nuevo.nombre);

  if (!existente) {
    return [...carrito, nuevo];
  }

  return carrito.map((item) =>
    item.nombre === nuevo.nombre
      ? { ...item, cantidad: item.cantidad + nuevo.cantidad }
      : item,
  );
}
