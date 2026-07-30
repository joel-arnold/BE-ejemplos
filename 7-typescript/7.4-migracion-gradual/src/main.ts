// ============================================================================
// LOS DOS MUNDOS CONVIVIENDO
// ============================================================================
// Este archivo .ts importa un .js con JSDoc (precios.js), un .js sin tipar
// (formato.js) y un módulo ya migrado (productos.repository.ts). Los tres
// funcionan a la vez: eso es lo que habilita `allowJs`.
// ============================================================================

import { conIva, conDescuento } from './precios.js';
import { formatearPrecio } from './formato.js';
import { findAll, findById } from './productos.repository.js';

console.clear();

const productos = await findAll();

console.log('=== Catálogo ===\n');

productos.forEach((producto) => {
  const final = conIva(producto.precio);
  console.log(`${producto.nombre}: ${formatearPrecio(final)}`);
});

console.log();

const teclado = await findById(1);

if (!teclado) {
  throw new Error('No se encontró el producto');
}

console.log('=== Oferta ===\n');
console.log(`${teclado.nombre} con 20% off: ${formatearPrecio(conDescuento(teclado.precio, 0.2))}`);

// ── Probá esto (con `npm run check`) ──
//
// 1. Descomentá la última línea de precios.js. El error se reporta DENTRO de un
//    archivo .js, gracias a checkJs + JSDoc:
//      src/precios.js(26,8): error TS2345: Argument of type 'string' is not
//      assignable to parameter of type 'number'.
//
// 2. Descomentá la línea de acá abajo: el mismo chequeo, pero desde un .ts que
//    llama a una función declarada en un .js.
// conIva('25000');
//
// 3. Poné "strict": true en el tsconfig.json: formato.js empieza a fallar con
//    "Parameter 'precio' implicitly has an 'any' type". Ese es el trabajo que
//    queda para terminar la migración.
