'use strict';
console.clear();

// ============================================================
// Clases y JSON: el viaje de ida y vuelta
// ============================================================
// Este es exactamente el trabajo de una API: llega un JSON, hay que
// convertirlo en un objeto del dominio para poder usarlo; y a la
// salida, convertir el objeto de vuelta en JSON.
//
// Lo que sorprende: JSON.parse SIEMPRE devuelve objetos PLANOS. Tienen
// los datos, pero no el comportamiento.

class Producto {
  #stock;

  constructor(nombre, precio, stock = 0) {
    this.nombre = nombre;
    this.precio = precio;
    this.#stock = stock;
  }

  get stock() {
    return this.#stock;
  }

  vender(cantidad) {
    if (cantidad > this.#stock) {
      throw new Error(`Stock insuficiente: hay ${this.#stock}`);
    }
    this.#stock -= cantidad;
    return this.#stock;
  }

  // método fábrica: la forma de volver a tener una INSTANCIA de verdad
  static desdeJSON(texto) {
    const datos = JSON.parse(texto);
    return new Producto(datos.nombre, datos.precio, datos.stock ?? 0);
  }
}

const teclado = new Producto('Teclado', 25000, 10);

// ---------- Ida: serializar ----------

const texto = JSON.stringify(teclado);
console.log(texto); // {"nombre":"Teclado","precio":25000}

// ¡se perdieron los métodos Y el campo privado #stock!

// ---------- Vuelta: deserializar ----------

const plano = JSON.parse(texto);

console.log(plano); // { nombre: 'Teclado', precio: 25000 }
console.log(plano instanceof Producto); // false: es un objeto plano

try {
  plano.vender(1);
} catch (error) {
  console.log(error.message); // plano.vender is not a function
}

// Con la fábrica sí:
const recuperado = Producto.desdeJSON('{"nombre":"Teclado","precio":25000,"stock":10}');

console.log();
console.log(recuperado instanceof Producto); // true
console.log(recuperado.vender(3)); // 7

// ============================================================
// toJSON: controlar qué se serializa
// ============================================================
// Si la clase define `toJSON()`, JSON.stringify lo llama solo. Sirve
// para incluir datos privados, ocultar datos sensibles (una contraseña)
// o cambiar el formato de salida.

class ProductoSerializable extends Producto {
  toJSON() {
    return {
      nombre: this.nombre,
      precio: this.precio,
      stock: this.stock, // el getter: ahora el privado sí sale
    };
  }
}

const mouse = new ProductoSerializable('Mouse', 12000, 25);

console.log();
console.log(JSON.stringify(mouse));
// {"nombre":"Mouse","precio":12000,"stock":25}

// Y funciona igual dentro de estructuras más grandes: stringify lo
// llama en cada objeto que lo tenga.
console.log(JSON.stringify({ carrito: [mouse], total: 1 }));
// {"carrito":[{"nombre":"Mouse","precio":12000,"stock":25}],"total":1}
