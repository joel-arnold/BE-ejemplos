import express from 'express'

// Una API REST mínima en Express entra cómoda en un solo archivo. Y funciona
// perfecto. El problema no es que falle: es que en cada handler conviven varias
// responsabilidades (hablar HTTP, validar, aplicar reglas de negocio y guardar
// datos), y eso se paga al crecer, testear y trabajar en equipo.

const app = express()
app.use(express.json())

const productos = [{ id: 1, nombre: 'Teclado', precio: 25000 }]

app.get('/api/productos', (req, res) => {
  res.json(productos)
})

app.post('/api/productos', (req, res) => {
  const { nombre, precio } = req.body
  if (!nombre || precio <= 0) {
    // validación
    return res.status(400).json({ error: 'Datos inválidos' })
  }
  const nuevo = { id: productos.length + 1, nombre, precio } // lógica de negocio
  productos.push(nuevo) // acceso a datos
  res.status(201).json(nuevo) // respuesta HTTP
})

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000/')
})
