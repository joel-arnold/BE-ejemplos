// ============================================================================
// TODAVÍA SIN TOCAR: un .js sin JSDoc
// ============================================================================
// Con "strict": false, TypeScript tolera que 'precio' y 'moneda' sean `any`
// implícitos y no dice nada. Al prender strict (último paso de la migración)
// este archivo va a empezar a dar:
//
//   Error: Parameter 'precio' implicitly has an 'any' type.
//
// Ese error es el más frecuente al migrar, y también el más fácil: se arregla
// anotando el parámetro (o agregándole JSDoc, como en precios.js).
// ============================================================================

export function formatearPrecio(precio, moneda = '$') {
  return `${moneda}${precio.toFixed(2)}`;
}
