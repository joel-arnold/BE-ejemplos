'use strict';

// ============================================================
// Herencia entre funciones constructoras
// ============================================================
// Acá `Celebridad` hereda de `Persona`. Para lograrlo hay dos pasos:
//   1. Reusar el constructor padre: Persona.call(this, ...) ejecuta
//      el constructor de Persona sobre el objeto que se está creando,
//      así hereda sus propiedades (nombre, apellido, edad).
//   2. Encadenar los prototipos: Celebridad.prototype se crea a
//      partir de Persona.prototype, para heredar también sus métodos
//      (saludar). Después se restaura `constructor`, que quedó
//      apuntando a Persona tras el paso anterior.
// Este "cableado manual" es justamente lo que la palabra clave
// `class` (tema 5) hace por nosotros de forma automática.

function Persona(nombre, apellido, edad) {
  this.nombre = nombre;
  this.apellido = apellido;
  this.edad = edad;
}

Persona.prototype.saludar = function () {
  return `Hola, soy ${this.nombre} ${this.apellido}`;
};

function Celebridad(nombre, apellido, edad, frase) {
  Persona.call(this, nombre, apellido, edad);
  this.frase = frase;
}

Celebridad.prototype = Object.create(Persona.prototype);
Celebridad.prototype.constructor = Celebridad;

Celebridad.prototype.decirFrase = function () {
  return `"${this.frase}". ${this.nombre} ${this.apellido}`;
};

const rosa = new Persona('Rosa', 'Martínez', 25);
const mirtha = new Celebridad(
  'Mirtha',
  'Legrand',
  25,
  'Como te ven, te tratan.'
);

console.log(`${rosa.nombre} dice:\n${rosa.saludar()}`);
console.log();
console.log(`${mirtha.nombre} saluda:\n${mirtha.saludar()}\ny dice: ${mirtha.decirFrase()}`);

console.log();
console.log('prototipo del objeto');
console.log(`¿mirtha.__proto__ es Celebridad.prototype? ${mirtha.__proto__ === Celebridad.prototype}`);
console.log(`¿mirtha.__proto__.__proto__ es Persona.prototype? ${mirtha.__proto__.__proto__ === Persona.prototype}`);
console.log(`¿mirtha.__proto__.__proto__ es rosa.__proto__? ${mirtha.__proto__.__proto__ === rosa.__proto__}`);

console.log();
console.log(`¿Celebridad.__proto__ es Persona? ${Celebridad.__proto__ === Persona}`);
console.log(`¿Celebridad.__proto__.__proto__ es Persona? ${Celebridad.__proto__.__proto__ === Persona}`);
console.log(`¿Celebridad.__proto__ es Function.prototype? ${Celebridad.__proto__ === Function.prototype}`);

console.log(`¿Celebridad.__proto__ es Persona.__proto__? ${Celebridad.__proto__ === Persona.__proto__}`);

console.log(`¿Celebridad.prototype.__proto__ es Persona.prototype? ${Celebridad.prototype.__proto__ === Persona.prototype}`);
