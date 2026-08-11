'use strict';
console.clear();

// ============================================================
// Polimorfismo: el mismo mensaje, distinta respuesta
// ============================================================
// Una vez que cada subclase implementa `precioFinal()` a su manera,
// el código que las usa DEJA DE PREGUNTAR de qué tipo son.
//
// Es la misma idea que las funciones de orden superior de 2.7: que el
// código genérico no necesite conocer los detalles de cada caso.

class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  precioFinal() {
    return this.precio * 1.21;
  }

  describir() {
    return `${this.nombre}: $${this.precioFinal().toFixed(2)}`;
  }
}

class ProductoFisico extends Producto {
  constructor(nombre, precio, pesoKg) {
    super(nombre, precio);
    this.pesoKg = pesoKg;
  }

  costoEnvio() {
    return this.pesoKg * 800;
  }

  precioFinal() {
    return super.precioFinal() + this.costoEnvio();
  }
}

class ProductoDigital extends Producto {
  constructor(nombre, precio, tamanioMb) {
    super(nombre, precio);
    this.tamanioMb = tamanioMb;
  }
}

const carrito = [
  new ProductoFisico('Teclado', 25000, 0.9),
  new ProductoDigital('Curso de Node', 30000, 1200),
  new ProductoFisico('Monitor', 180000, 4.2),
];

// El for...of no sabe ni le importa qué tipo es cada uno:
for (const producto of carrito) {
  console.log(producto.describir());
}
// Teclado: $30970.00
// Curso de Node: $36300.00
// Monitor: $221160.00

const total = carrito.reduce((acum, p) => acum + p.precioFinal(), 0);

console.log();
console.log(`Total: $${total.toFixed(2)}`); // Total: $288430.00

// ============================================================
// Lo que el polimorfismo evita
// ============================================================
// Sin polimorfismo, el cálculo se convierte en un if por tipo que hay
// que ir a tocar cada vez que aparece un producto nuevo:
//
// let total = 0;
// for (const p of carrito) {
//   if (p.tipo === 'fisico') {
//     total += p.precio * 1.21 + p.pesoKg * 800;
//   } else if (p.tipo === 'digital') {
//     total += p.precio * 1.21;
//   }
// }
//
// Con polimorfismo, agregar `ProductoPerecedero` no obliga a tocar
// NINGUNA de las líneas de arriba: alcanza con que la clase nueva
// sepa responder a precioFinal().

class ProductoPerecedero extends Producto {
  constructor(nombre, precio, diasParaVencer) {
    super(nombre, precio);
    this.diasParaVencer = diasParaVencer;
  }

  precioFinal() {
    const descuento = this.diasParaVencer <= 3 ? 0.5 : 1;
    return super.precioFinal() * descuento;
  }
}

carrito.push(new ProductoPerecedero('Yogur', 2000, 2));

console.log();
console.log(carrito.at(-1).describir()); // Yogur: $1210.00
console.log(
  `Total: $${carrito.reduce((a, p) => a + p.precioFinal(), 0).toFixed(2)}`,
); // Total: $289640.00
