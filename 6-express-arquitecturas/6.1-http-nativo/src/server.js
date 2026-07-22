import http from 'node:http'

// Node no necesita instalar nada para levantar una API: el módulo http del
// core alcanza. El costo es que toda la "plomería" HTTP queda a nuestro cargo.

const productos = [{ id: 1, nombre: 'Teclado', precio: 25000 }]

const server = http.createServer((req, res) => {
  // Ruteo manual: comparar método + url a mano.
  if (req.method === 'GET' && req.url === '/api/productos') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(productos))
    return
  }

  if (req.method === 'POST' && req.url === '/api/productos') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk // Juntar el body de a pedazos.
    })
    req.on('end', () => {
      let data
      try {
        data = JSON.parse(body) // Parsear el JSON a mano.
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'JSON inválido' }))
        return
      }

      const { nombre, precio } = data
      if (!nombre || precio === undefined || precio <= 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Datos inválidos' }))
        return
      }

      const nuevo = { id: productos.length + 1, nombre, precio }
      productos.push(nuevo)
      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(nuevo))
    })
    return
  }

  // Cualquier otra ruta: 404 a mano.
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'No encontrado' }))
})

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000/')
})
