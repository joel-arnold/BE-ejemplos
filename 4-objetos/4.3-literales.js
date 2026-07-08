'use strict';
console.clear();

// ============================================================
// Objetos literales y su prototipo
// ============================================================
// Un objeto literal se crea directamente con llaves { }. Todo
// objeto tiene un prototipo interno (`__proto__`): un objeto del
// que "hereda" propiedades y métodos. Cuando se crea con un
// literal, ese prototipo es `Object.prototype` (de ahí salen
// métodos como toString). Y el prototipo de `Object.prototype`
// es `null`: ahí termina la cadena de prototipos.

const rosa = {
  nombre: 'Rosa',
  apellido: 'Martínez',
  edad: 25,
  saludar() {
    return `Hola, soy ${this.nombre} ${this.apellido}`;
  },
};

console.log(`${rosa.nombre} dice:\n${rosa.saludar()}`);

console.log(`el prototipo de rosa es: ${JSON.stringify(rosa.__proto__)}`);

console.log(Object.prototype == rosa.__proto__);

console.log(`el prototipo del prototipo de rosa es: ${JSON.stringify(rosa.__proto__.__proto__)}`);
