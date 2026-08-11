import { crearProductosService } from './services/productos.service.js';
import { productosRepository } from './repositories/productos.repository.js';
import type { PayloadToken } from './domain/producto.js';

// ============================================================================
// EL PUNTO DONDE SE ARMA TODO (composition root)
// ============================================================================
// El service pide un repository y acá se le da el de verdad. Es el ÚNICO lugar
// de la aplicación donde se decide cuál es "el de verdad": una línea.
//
// Corré `npm start` y después `npm test`. Es el mismo service en los dos casos.
// Acá habla con el repository real; en los tests, con uno de mentira. Nunca se
// entera, porque nunca eligió.
// ============================================================================

const service = crearProductosService(productosRepository);

const juan: PayloadToken = { sub: '1', email: 'juan@utn.edu.ar', rol: 'usuario' };

console.log('Productos:', await service.listar());

const creado = await service.crear({ nombre: 'Yerba', precio: 3500 }, juan);
console.log('Creado:', creado);
// Creado: { id: 3, nombre: 'Yerba', precio: 3500, creadoPorId: 1 }

try {
  // El producto 2 es de otro usuario: la regla de la unidad 9 lo frena.
  await service.eliminar(2, juan);
} catch (error) {
  console.log('Error esperado:', (error as Error).message);
  // Error esperado: Solo podés borrar los productos que creaste
}
