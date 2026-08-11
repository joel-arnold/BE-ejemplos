'use strict';
console.clear();

// ============================================================
// Herencia: extends y super
// ============================================================
// Un producto físico y uno digital comparten casi todo (nombre,
// precio) pero se diferencian en algo: el físico se envía.
// `extends` permite escribir solo la diferencia.
//
// `super` hace dos trabajos distintos según dónde aparezca:
//   - super(...)       en el constructor: llama al constructor del padre.
//   - super.metodo()   en un método: llama a la versión del padre.
//
// Comparar con 4.7-funcionesConstructorasHerencia.js, donde lo mismo
// requería tres pasos manuales fáciles de olvidar.

class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  describir() {
    return `${this.nombre}: $${this.precio}`;
  }

  precioFinal() {
    return this.precio * 1.21;
  }
}

class ProductoFisico extends Producto {
  constructor(nombre, precio, pesoKg) {
    super(nombre, precio); // ejecuta el constructor de Producto
    this.pesoKg = pesoKg; // lo propio va DESPUÉS
  }

  costoEnvio() {
    return this.pesoKg * 800;
  }

  // sobrescribe el método del padre y lo reutiliza con super.
  precioFinal() {
    return super.precioFinal() + this.costoEnvio();
  }
}

class ProductoDigital extends Producto {
  constructor(nombre, precio, tamanioMb) {
    super(nombre, precio);
    this.tamanioMb = tamanioMb;
  }

  // no sobrescribe precioFinal: hereda el de Producto, sin envío
}

const teclado = new ProductoFisico('Teclado', 25000, 0.9);
const curso = new ProductoDigital('Curso de Node', 30000, 1200);

console.log(teclado.describir()); // Teclado: $25000 (heredado)
console.log(teclado.costoEnvio()); // 720
console.log(teclado.precioFinal()); // 30970.000000000004

console.log();
console.log(curso.describir()); // Curso de Node: $30000
console.log(curso.precioFinal()); // 36300 (el del padre, sin envío)

// ============================================================
// super() va PRIMERO, siempre
// ============================================================
// Tocar `this` antes de llamar a super() tira ReferenceError: hasta
// que no corre el constructor del padre, el objeto todavía no existe.
//
// class Roto extends Producto {
//   constructor(nombre, precio) {
//     this.nombre = nombre;  // antes de super()
//     super(nombre, precio);
//   }
// }
// ReferenceError: Must call super constructor in derived class before
// accessing 'this' or returning from derived constructor

// Si la subclase NO define constructor, JS le pone uno que llama a
// super(...) con todos los argumentos. Por eso a veces "funciona sin
// escribirlo":
class ProductoDestacado extends Producto {
  describir() {
    return `⭐ ${super.describir()}`;
  }
}

console.log();
console.log(new ProductoDestacado('Monitor', 180000).describir());
// ⭐ Monitor: $180000

// ============================================================
// La cadena de prototipos e instanceof
// ============================================================
// extends no inventó nada: enganchó un eslabón más en la cadena.
//   teclado -> ProductoFisico.prototype -> Producto.prototype
//           -> Object.prototype -> null

console.log();
console.log(teclado instanceof ProductoFisico); // true
console.log(teclado instanceof Producto); // true: también es un Producto
console.log(teclado instanceof Object); // true
console.log(curso instanceof ProductoFisico); // false

// Al pedir precioFinal(), JS lo encuentra ANTES, en la subclase: por eso
// gana el de ProductoFisico.
console.log(
  Object.getPrototypeOf(teclado) === ProductoFisico.prototype, // true
);
console.log(
  Object.getPrototypeOf(ProductoFisico.prototype) === Producto.prototype, // true
);
