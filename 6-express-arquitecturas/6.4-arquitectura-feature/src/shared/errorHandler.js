import { ValidationError } from './errors.js'

// Middleware transversal a todos los features: manejo de errores en un solo
// lugar. Express lo reconoce por tener cuatro parámetros; va al final de la
// cadena y recibe lo que los controllers pasan con next(err).
export function errorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message })
  }
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
}
