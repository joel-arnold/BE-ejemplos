import express from 'express'
import { productosRouter } from './productos/productos.routes.js'
import { usuariosRouter } from './usuarios/usuarios.routes.js'
import { errorHandler } from './shared/errorHandler.js'

const app = express()
app.use(express.json())

// Cada feature expone su router y se monta en su ruta base. Sumar un recurso es
// crear una carpeta y montar una línea más acá.
app.use('/api/productos', productosRouter)
app.use('/api/usuarios', usuariosRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' })
})

app.use(errorHandler)

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000/')
})
