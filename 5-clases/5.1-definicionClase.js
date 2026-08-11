'use strict';
console.clear();

// ============================================================
// De la función constructora a `class`
// ============================================================
// En 4.6 creamos objetos con una función constructora y colgamos
// los métodos de `Persona.prototype`. Desde ES6 existe `class`, que
// hace EXACTAMENTE lo mismo con una sintaxis más clara.
//
// `class` es "azúcar sintáctico": por debajo sigue habiendo
// prototipos, y en este archivo lo comprobamos.
//
// Desde acá cambiamos de dominio: pasamos de `Persona` a `Producto`,
// que es el caso que se usa en el resto del material (APIs, TypeScript
// y base de datos).

// ---------- La forma vieja: función constructora ----------

function ProductoViejo(nombre, precio) {
  this.nombre = nombre;
  this.precio = precio;
}

ProductoViejo.prototype.describir = function () {
  return `${this.nombre}: $${this.precio}`;
};

// ---------- La forma moderna: class ----------

class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  describir() {
    return `${this.nombre}: $${this.precio}`;
  }
}

const viejo = new ProductoViejo('Teclado', 25000);
const teclado = new Producto('Teclado', 25000);

console.log(viejo.describir()); // Teclado: $25000
console.log(teclado.describir()); // Teclado: $25000

// ============================================================
// Por debajo son lo mismo
// ============================================================

console.log();
console.log('una clase es una función:');
console.log(typeof Producto); // function

console.log();
console.log('los métodos viven en el prototipo:');
console.log(Object.getPrototypeOf(teclado) === Producto.prototype); // true
console.log(teclado.describir === Producto.prototype.describir); // true
console.log(teclado.hasOwnProperty('describir')); // false: lo hereda

// ============================================================
// Cuatro cosas que `class` SÍ cambia
// ============================================================

// 1. `new` es obligatorio
try {
  Producto('Teclado', 25000);
} catch (error) {
  console.log();
  console.log(error.message);
  // Class constructor Producto cannot be invoked without 'new'
}

// La función constructora, en cambio, se dejaba llamar sin `new`. En
// modo NO estricto `this` iba al objeto global y le cargaba `nombre` y
// `precio` en silencio: un bug muy difícil de encontrar. Acá el archivo
// declara 'use strict', así que `this` es undefined y al menos falla:
try {
  ProductoViejo('Mouse', 12000);
} catch (error) {
  console.log(error.message);
  // Cannot set properties of undefined (setting 'nombre')
}

// 2. No hay hoisting utilizable: las clases están en la "temporal dead
//    zone", igual que `let` y `const` (ver 2.6-hoisting.js).
// const antes = new Categoria('Periféricos');
// class Categoria { constructor(nombre) { this.nombre = nombre; } }
// ReferenceError: Cannot access 'Categoria' before initialization

// 3. El cuerpo de una clase corre SIEMPRE en modo estricto, aunque el
//    archivo no lo declare. Esto explica el error de 5.8-thisPerdido.js.

// 4. Los métodos no son enumerables: al recorrer un objeto salen sus
//    datos, no su comportamiento.
console.log();
console.log(Object.keys(teclado)); // [ 'nombre', 'precio' ]
