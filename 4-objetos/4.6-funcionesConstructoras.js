'use strict';

// ============================================================
// Funciones constructoras
// ============================================================
// Una función constructora es una función pensada para crearse
// con `new`. Por convención se escribe con la primera letra en
// MAYÚSCULA (Persona). Al hacer `new Persona(...)`:
//   1. se crea un objeto vacío,
//   2. `this` apunta a ese objeto nuevo,
//   3. se ejecuta el cuerpo (que le carga propiedades),
//   4. se devuelve el objeto automáticamente.
// Los métodos se cuelgan de `Persona.prototype` para que TODAS las
// instancias los compartan (una sola copia, no una por objeto).

function Persona(nombre, apellido, edad) {
  this.nombre = nombre;
  this.apellido = apellido;
  this.edad = edad;
}

Persona.prototype.saludar = function () {
  return `Hola, soy ${this.nombre} ${this.apellido}`;
};

const rosa = new Persona('Rosa', 'Martínez', 25);

console.log(`${rosa.nombre} dice:\n${rosa.saludar()}`);
console.log();
console.log('prototipo del objeto');
console.log(`¿rosa.__proto__ es Persona? ${rosa.__proto__ === Persona}`);
console.log(`¿rosa.__proto__ es Persona.__proto__? ${rosa.__proto__ === Persona.__proto__}`);
console.log(`¿rosa.__proto__ es Persona.prototype? ${rosa.__proto__ === Persona.prototype}`);

console.log();
console.log('prototipo de Persona');
console.log(`¿Persona.__proto__ es Persona.prototype? ${Persona.__proto__ === Persona.prototype}`);
console.log(`¿Persona.__proto__ es Function.prototype? ${Persona.__proto__ === Function.prototype}`);
console.log(`¿Persona.prototype es Object.prototype? ${Persona.prototype === Object.prototype}`);
console.log(`¿Persona.prototype.__proto__ es Object.prototype? ${Persona.prototype.__proto__ === Object.prototype}`);
