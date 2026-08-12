// La función de la unidad 10, sin cambios. Está acá para que el repositorio
// tenga algo que testear y el workflow tenga algo que correr.

export function aplicarDescuento(precio: number, porcentaje: number): number {
  if (porcentaje < 0 || porcentaje > 100) {
    throw new RangeError('El descuento va de 0 a 100');
  }

  return precio - (precio * porcentaje) / 100;
}

export function precioConIva(precio: number): number {
  return Math.round(precio * 1.21 * 100) / 100;
}
