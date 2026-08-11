// ============================================================================
// FUNCIONES PURAS — el lugar más fácil del mundo para empezar a testear
// ============================================================================
// Una función pura es la que, con las mismas entradas, devuelve siempre lo
// mismo y no toca nada de afuera: no lee la base, no escribe archivos, no mira
// la hora. Se testea sin preparar nada.
//
// El 90% de la dificultad de testear un sistema es que su lógica NO está en
// funciones así. Por eso esta unidad empieza acá y después va subiendo.
// ============================================================================

const IVA = 0.21;

export function aplicarDescuento(precio: number, porcentaje: number): number {
  if (porcentaje < 0 || porcentaje > 100) {
    throw new RangeError('El descuento va de 0 a 100');
  }

  return precio - (precio * porcentaje) / 100;
}

export function precioConIva(precio: number): number {
  // Los precios se redondean a dos decimales. Esto va a importar en un test:
  // 1999.99 * 1.21 da 2419.9879 y nadie cobra fracciones de centavo.
  return Math.round(precio * (1 + IVA) * 100) / 100;
}

export function esPrecioValido(precio: number): boolean {
  return Number.isFinite(precio) && precio > 0;
}
