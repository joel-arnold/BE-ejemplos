import express from 'express'
import { productosRouter } from './routes/productos.routes.js'
import { errorHandler } from './shared/errorHandler.js'

const app = express()

// Middlewares globales: parseo del body, y acá irían logging, auth, etc.
app.use(express.json())

// La route matchea método + URL y delega en el controller.
app.use('/api/productos', productosRouter)

// Ruta no encontrada.
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' })
})

// Middleware de errores: siempre al final de la cadena.
app.use(errorHandler)

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000/')
})
