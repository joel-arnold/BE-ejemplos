'use strict';
console.clear();

// ============================================================
// El `this` que se pierde
// ============================================================
// Regla: `this` apunta al objeto sobre el que se INVOCÓ el método.
// La trampa está en esa palabra: no depende de dónde se escribió el
// método, sino de CÓMO se lo llama.
//
// Este es el bug más común al escribir clases en un backend.

class Carrito {
  items = [];

  agregar(nombre) {
    this.items.push(nombre);
    return this.items.length;
  }

  vaciar() {
    this.items = [];
    console.log('Carrito vaciado');
  }

  describir() {
    return `Carrito con ${this.items.length} item(s)`;
  }
}

const carrito = new Carrito();

carrito.agregar('Teclado');
console.log(carrito.describir()); // Carrito con 1 item(s)

// ---------- Cómo se pierde ----------

const describir = carrito.describir; // guardo la función, sin llamarla

try {
  describir();
} catch (error) {
  console.log(error.message);
  // Cannot read properties of undefined (reading 'items')
}

// Es la MISMA función. Lo que cambió es que no hay ningún objeto a la
// izquierda del punto, así que `this` queda `undefined`: el cuerpo de
// una clase corre siempre en modo estricto (ver 5.1), y en modo
// estricto `this` no cae al objeto global.

// ============================================================
// Dónde aparece de verdad: al pasar un método como callback
// ============================================================
// Nadie escribe `const describir = carrito.describir` a propósito.
// El problema real es que pasar un método como callback hace
// exactamente eso.

try {
  ['Mouse', 'Monitor'].forEach(carrito.agregar); // ❌
} catch (error) {
  console.log(error.message);
  // Cannot read properties of undefined (reading 'items')
}

// La misma línea, en Express (unidad 6), es el bug clásico del TP:
//   router.get('/api/productos', controller.getAll);   ❌
// El código "se ve bien" y explota en el primer GET.

// ============================================================
// Las tres soluciones
// ============================================================

// 1. bind: devuelve una función nueva con el `this` fijado
['Mouse', 'Monitor'].forEach(carrito.agregar.bind(carrito));
console.log();
console.log(carrito.describir()); // Carrito con 3 item(s)

// 2. envolver en una arrow function: la invocación conserva el punto
['Auriculares'].forEach((nombre) => carrito.agregar(nombre));
console.log(carrito.describir()); // Carrito con 4 item(s)

// 3. definir el método como campo con arrow function
class CarritoSeguro {
  items = [];

  // una arrow function NO tiene `this` propio: lo toma del lugar donde
  // fue creada, que acá es la instancia (ver 2.5-funcionFlecha.js)
  agregar = (nombre) => {
    this.items.push(nombre);
    return this.items.length;
  };

  describir() {
    return `Carrito con ${this.items.length} item(s)`;
  }
}

const seguro = new CarritoSeguro();
['Teclado', 'Mouse'].forEach(seguro.agregar); // ✅ ahora sí

console.log();
console.log(seguro.describir()); // Carrito con 2 item(s)

// Costo de la opción 3: el método deja de vivir en el prototipo y pasa
// a ser una copia POR INSTANCIA (y no se hereda ni se sobrescribe bien).
console.log(seguro.hasOwnProperty('agregar')); // true: es de la instancia
console.log(carrito.hasOwnProperty('agregar')); // false: está en el prototipo

// ============================================================
// Cuándo usar cada una
// ============================================================
// bind          -> puntual, cuando se pasa el método una sola vez.
// arrow envuelve-> lo más legible y lo más común hoy.
// campo arrow   -> cuando el método SIEMPRE se usa como callback.
