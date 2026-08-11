'use strict';
console.clear();

// ============================================================
// Campos y métodos privados (prefijo #)
// ============================================================
// Durante años, "privado" en JS fue una convención: se ponía un guion
// bajo adelante (`_stock`) y se confiaba en que nadie lo tocara. No
// impedía nada.
//
// Desde ES2022 hay miembros REALMENTE privados: los que empiezan con
// `#`. Solo se pueden leer o escribir desde adentro de la clase, y
// deben declararse arriba, antes del constructor.
//
// El objetivo no es esconder por esconder: es que toda modificación
// del stock pase por `vender()`, que es donde vive la regla de negocio.

class Producto {
  #stock; // privado

  constructor(nombre, precio, stock = 0) {
    this.nombre = nombre;
    this.precio = precio;
    this.#stock = stock;
  }

  // se puede leer desde afuera, pero no escribir: hay getter y no setter
  get stock() {
    return this.#stock;
  }

  vender(cantidad) {
    this.#validarCantidad(cantidad); // método privado
    if (cantidad > this.#stock) {
      throw new Error(`Stock insuficiente: hay ${this.#stock}`);
    }
    this.#stock -= cantidad;
    return this.#stock;
  }

  reponer(cantidad) {
    this.#validarCantidad(cantidad);
    this.#stock += cantidad;
    return this.#stock;
  }

  // los métodos también pueden ser privados
  #validarCantidad(cantidad) {
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error('La cantidad tiene que ser un entero positivo');
    }
  }
}

const teclado = new Producto('Teclado', 25000, 10);

console.log(teclado.stock); // 10 (el getter, sí)
console.log(teclado.vender(3)); // 7
console.log(teclado.reponer(5)); // 12

// La regla de negocio no se puede esquivar:
try {
  teclado.vender(999);
} catch (error) {
  console.log(error.message); // Stock insuficiente: hay 12
}

try {
  teclado.vender(-1);
} catch (error) {
  console.log(error.message); // La cantidad tiene que ser un entero positivo
}

// Asignar desde afuera no cambia nada: hay getter y no hay setter. En
// modo estricto (el de este archivo, y el del cuerpo de toda clase)
// además avisa; sin 'use strict' fallaría en silencio.
try {
  teclado.stock = 9999;
} catch (error) {
  console.log(error.message);
  // Cannot set property stock of #<Producto> which has only a getter
}
console.log(teclado.stock); // 12

// Y acceder al campo privado no es un error que se pueda atrapar:
// es un error de SINTAXIS, el archivo entero no arranca.
// console.log(teclado.#stock);
// SyntaxError: Private field '#stock' must be declared in an enclosing class

// El privado tampoco aparece al recorrer el objeto ni al serializarlo:
console.log();
console.log(Object.keys(teclado)); // [ 'nombre', 'precio' ]
console.log(JSON.stringify(teclado)); // {"nombre":"Teclado","precio":25000}
