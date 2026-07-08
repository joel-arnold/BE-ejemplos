'use strict';

// ============================================================
// Fábrica de objetos (factory function)
// ============================================================
// Una "fábrica" es simplemente una función que arma y DEVUELVE un
// objeto ya listo. No usa `new` ni `this` complicados: cada llamada
// devuelve un objeto independiente. Es la forma más sencilla y
// directa de crear objetos con datos y métodos.
// Detalle de sintaxis: cuando la propiedad y la variable se llaman
// igual, se puede escribir abreviado (`nombre` en vez de `nombre: nombre`).

function crearPersona(nombre, apellido, edad) {
  return {
    nombre,
    apellido,
    edad,
    saludar() {
      return `Hola, soy ${this.nombre} ${this.apellido}`;
    },
  };
}

const rosa = crearPersona('Rosa', 'Martínez', 25);
console.log(`${rosa.nombre} dice:\n${rosa.saludar()}`);
