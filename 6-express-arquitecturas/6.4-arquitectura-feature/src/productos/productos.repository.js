const productos = [{ id: 1, nombre: 'Teclado', precio: 25000 }]

export async function findAll() {
  return productos
}

export async function guardar(datos) {
  const nuevo = { id: productos.length + 1, ...datos }
  productos.push(nuevo)
  return nuevo
}
