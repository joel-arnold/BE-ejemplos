'use strict';
console.clear();

// ============================================================
// Miembros estáticos (static)
// ============================================================
// Un miembro `static` pertenece a la CLASE, no a cada instancia. Se
// usa cuando la operación no necesita un objeto concreto:
//   - constantes de la clase
//   - contadores
//   - métodos fábrica, que construyen instancias
//
// Ya los usaron sin saberlo: `Math.random()`, `Number.isInteger()`,
// `Object.keys()` y `Array.from()` son todos métodos estáticos.

class Producto {
  static #creados = 0; // campo estático privado
  static IVA = 0.21; // constante de la clase

  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
    Producto.#creados++; // ojo: Producto, no this
  }

  static get creados() {
    return Producto.#creados;
  }

  // método fábrica: construye una instancia desde otra representación
  static desdeJSON(texto) {
    const datos = JSON.parse(texto);
    return new Producto(datos.nombre, datos.precio);
  }

  // otra fábrica: un producto de regalo, sin tener que recordar el precio 0
  static gratis(nombre) {
    return new Producto(nombre, 0);
  }

  precioFinal() {
    return this.precio * (1 + Producto.IVA);
  }
}

new Producto('Teclado', 25000);
new Producto('Mouse', 12000);

console.log(Producto.creados); // 2 (se le pide a la CLASE, no a un objeto)
console.log(Producto.IVA); // 0.21

const desdeTexto = Producto.desdeJSON('{"nombre":"Monitor","precio":180000}');
console.log(desdeTexto.nombre); // Monitor
console.log(desdeTexto.precioFinal()); // 217800
console.log(Producto.creados); // 3: la fábrica también usa new

const sticker = Producto.gratis('Sticker DSW');
console.log(sticker.precioFinal()); // 0

// ============================================================
// Un método estático no tiene instancia
// ============================================================
// Dentro de un método estático, `this` es la clase, no un objeto:
// no hay `this.nombre` ni `this.precio` que valgan.

console.log();
console.log(typeof Producto.desdeJSON); // function
console.log(typeof sticker.desdeJSON); // undefined: NO está en las instancias

// Llamarlo sobre un objeto no funciona:
// sticker.desdeJSON('{}');
// TypeError: sticker.desdeJSON is not a function
