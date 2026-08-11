'use strict';
console.clear();

// ============================================================
// Anatomía de una clase
// ============================================================
// Una clase tiene tres tipos de miembro:
//   1. CAMPOS DE INSTANCIA: los datos, con valor por defecto.
//      Se escriben sin `let`/`const` y sin coma al final.
//   2. CONSTRUCTOR: se ejecuta una sola vez, al hacer `new`.
//   3. MÉTODOS DE INSTANCIA: el comportamiento.
//
// Regla que conviene retener: los DATOS van a la instancia y los
// MÉTODOS van al prototipo (una sola copia, compartida por todos
// los objetos de esa clase).

class Producto {
  // 1. campos de instancia
  stock = 0;
  activo = true;

  // 2. constructor
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  // 3. métodos de instancia
  describir() {
    return `${this.nombre}: $${this.precio} (stock: ${this.stock})`;
  }

  precioFinal() {
    return this.precio * 1.21; // IVA
  }
}

const teclado = new Producto('Teclado', 25000);
teclado.stock = 12;

console.log(teclado.describir()); // Teclado: $25000 (stock: 12)
console.log(teclado.precioFinal()); // 30250

// Acá dio redondo, pero no siempre pasa: la aritmética de punto flotante
// arrastra error (0.1 + 0.2 da 0.30000000000000004). Es el motivo por el
// que la plata no se guarda en `float`.
console.log(0.1 + 0.2); // 0.30000000000000004

// ============================================================
// Dónde vive cada cosa
// ============================================================

console.log();
console.log(Object.keys(teclado)); // [ 'stock', 'activo', 'nombre', 'precio' ]

console.log(teclado.hasOwnProperty('precio')); // true: es suyo
console.log(teclado.hasOwnProperty('describir')); // false: lo hereda

// Si creamos mil productos hay mil copias de `nombre` y `precio`,
// pero UNA sola copia de `describir`, compartida por todos:
const mouse = new Producto('Mouse', 12000);
console.log(teclado.describir === mouse.describir); // true

// ============================================================
// Métodos async
// ============================================================
// Un método puede ser `async` como cualquier función (ver la unidad 3).
// Así se escriben los services y repositories de la unidad 6.

class ProductoService {
  async buscarPorId(id) {
    // acá iría un fetch o una consulta a la base; lo simulamos
    await new Promise((resolve) => setTimeout(resolve, 100));
    return new Producto(`Producto ${id}`, 1000 * id);
  }
}

// este archivo no es un módulo ESM, así que el await va adentro de una
// función async (ver 3.7-async-await.js)
async function main() {
  const service = new ProductoService();
  const encontrado = await service.buscarPorId(3);

  console.log();
  console.log(encontrado.describir()); // Producto 3: $3000 (stock: 0)
}

main();
