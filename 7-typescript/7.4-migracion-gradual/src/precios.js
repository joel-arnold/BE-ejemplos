// ============================================================================
// PASO INTERMEDIO: un archivo .js todavía, pero ya chequeado
// ============================================================================
// Con "checkJs": true, TypeScript lee los comentarios JSDoc y chequea este
// archivo SIN cambiarle la extensión. Es la forma más barata de ver cuánto
// rompería la migración antes de encararla.
// ============================================================================

/**
 * @param {number} precio
 * @returns {number}
 */
export function conIva(precio) {
  return precio * 1.21;
}

/**
 * @param {number} precio
 * @param {number} porcentaje - entre 0 y 1
 * @returns {number}
 */
export function conDescuento(precio, porcentaje) {
  return precio * (1 - porcentaje);
}

// conIva('25000');
// Error: Argument of type 'string' is not assignable to parameter of type
//        'number'.  <- y esto es un archivo .js
