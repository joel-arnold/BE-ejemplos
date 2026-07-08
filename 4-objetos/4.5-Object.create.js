'use strict';
console.clear();

// ============================================================
// Object.create()
// ============================================================
// `Object.create(prototipo, propiedades)` crea un objeto nuevo
// indicando EXPLÍCITAMENTE cuál va a ser su prototipo. Es la forma
// "canónica" de armar la herencia que en 4.4 hacíamos a mano con
// __proto__. El segundo parámetro (opcional) define las propiedades
// propias usando "descriptores": cada propiedad se declara como
// { value: ... } (y admite opciones como writable, enumerable, etc.).
// Acá `mirtha` hereda `saludar()` de `rosa`, pero define su propio
// nombre y apellido.

const rosa = {
  nombre: 'Rosa',
  apellido: 'Martínez',
  edad: 25,
  saludar() {
    return `Hola, soy ${this.nombre} ${this.apellido}`;
  },
};

const mirtha = Object.create(rosa, {
  nombre: { value: 'Mirtha' },
  apellido: { value: 'Legrand' },
});

console.log(`${rosa.nombre} dice:\n${rosa.saludar()}`);
console.log(`${mirtha.nombre} dice:\n${mirtha.saludar()}`);
console.log();

console.log(`el prototipo de mirtha es: ${JSON.stringify(mirtha.__proto__)}`);

console.log(rosa == mirtha.__proto__);

console.log(`el prototipo del prototipo de mirtha es: ${JSON.stringify(mirtha.__proto__.__proto__)}`);

console.log(
  `el prototipo del prototipo del prototipo del literal es: ${JSON.stringify(mirtha.__proto__.__proto__.__proto__)}`
);

// También podemos crear un objeto "desde cero" (con prototipo {})
// definiendo TODAS sus propiedades y métodos mediante descriptores.
const rosaNoLiteral = Object.create(
  {},
  {
    nombre: { value: 'Rosa no-literal' },
    apellido: { value: 'Martínez' },
    edad: { value: 25 },
    saludar: {
      value: function () {
        return `Hola, soy ${this.nombre} ${this.apellido}`;
      },
    },
  }
);

console.log(`${rosaNoLiteral.nombre} dice:\n${rosaNoLiteral.saludar()}`);
