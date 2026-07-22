const usuarios = [{ id: 1, nombre: 'Ada', email: 'ada@example.com' }]

export async function findAll() {
  return usuarios
}

export async function guardar(datos) {
  const nuevo = { id: usuarios.length + 1, ...datos }
  usuarios.push(nuevo)
  return nuevo
}
