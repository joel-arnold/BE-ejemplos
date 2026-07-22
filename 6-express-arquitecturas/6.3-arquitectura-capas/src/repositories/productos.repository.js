// El único lugar que sabe DÓNDE y CÓMO viven los datos. Hoy es un array en
// memoria; mañana puede ser MongoDB o MySQL y solo cambia este archivo.
//
// Las operaciones son async aunque hoy el array sea sincrónico: cuando el
// repository hable con una base de datos real la firma (una promesa) ya está
// lista y nada más cambia.

const productos = [{ id: 1, nombre: 'Teclado', precio: 25000 }]

export async function findAll() {
  return productos
}

export async function guardar(datos) {
  const nuevo = { id: productos.length + 1, ...datos }
  productos.push(nuevo)
  return nuevo
}
