'use strict';
console.clear();

// ============================================================
// Composición vs. herencia
// ============================================================
// La herencia es cómoda y por eso se abusa de ella. El problema:
// la clase de un objeto NO SE PUEDE CAMBIAR. Si la oferta termina, no
// hay forma de que el objeto deje de ser un `ProductoEnOferta`. Y si
// además el producto es digital, hacen falta ProductoDigitalEnOferta
// y ProductoFisicoEnOferta: la jerarquía se multiplica.
//
// Regla práctica:
//   heredá cuando la subclase ES un tipo distinto y permanente;
//   componé cuando es algo que el objeto TIENE y puede cambiar.

// ---------- La oferta no es una especie de producto: es algo que tiene ----------

class DescuentoPorcentual {
  constructor(porcentaje) {
    this.porcentaje = porcentaje;
  }

  aplicar(monto) {
    return monto * (1 - this.porcentaje / 100);
  }

  describir() {
    return `${this.porcentaje}% off`;
  }
}

class DescuentoFijo {
  constructor(monto) {
    this.monto = monto;
  }

  aplicar(monto) {
    return Math.max(0, monto - this.monto);
  }

  describir() {
    return `$${this.monto} de descuento`;
  }
}

class Producto {
  descuento = null; // composición: el producto TIENE un descuento (o no)

  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  precioFinal() {
    const base = this.precio * 1.21;
    return this.descuento ? this.descuento.aplicar(base) : base;
  }

  describir() {
    const oferta = this.descuento ? ` [${this.descuento.describir()}]` : '';
    return `${this.nombre}: $${this.precioFinal().toFixed(2)}${oferta}`;
  }
}

const teclado = new Producto('Teclado', 25000);
console.log(teclado.describir()); // Teclado: $30250.00

// La oferta empieza...
teclado.descuento = new DescuentoPorcentual(20);
console.log(teclado.describir()); // Teclado: $24200.00 [20% off]

// ...cambia de tipo sin tocar la clase...
teclado.descuento = new DescuentoFijo(5000);
console.log(teclado.describir()); // Teclado: $25250.00 [$5000 de descuento]

// ...y termina. El objeto es el mismo de siempre.
teclado.descuento = null;
console.log(teclado.describir()); // Teclado: $30250.00

// Con herencia, cada uno de esos cambios habría requerido crear un
// objeto NUEVO de otra clase, perdiendo la identidad del producto.

// ============================================================
// Cómo se ve el mismo caso con herencia
// ============================================================
// class ProductoEnOferta extends Producto { ... }
// class ProductoDigitalEnOferta extends ProductoDigital { ... }
// class ProductoConDescuentoFijo extends Producto { ... }
//   -> una clase nueva por cada combinación, y ninguna reversible.
//
// Un aviso práctico: jerarquías de más de dos niveles casi siempre
// son un error de modelado. Sirve como criterio al diseñar el TP.

// ============================================================
// Notar que los dos descuentos son intercambiables
// ============================================================
// DescuentoPorcentual y DescuentoFijo no comparten clase padre: solo
// coinciden en saber responder `aplicar(monto)`. Eso alcanza, y es
// el mismo polimorfismo de 5.7 sin necesidad de herencia.

const descuentos = [new DescuentoPorcentual(10), new DescuentoFijo(3000)];

console.log();
for (const descuento of descuentos) {
  console.log(`${descuento.describir()} sobre $10000 -> $${descuento.aplicar(10000)}`);
}
// 10% off sobre $10000 -> $9000
// $3000 de descuento sobre $10000 -> $7000
