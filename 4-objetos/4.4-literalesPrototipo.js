'use strict';
console.clear();

// ============================================================
// Herencia entre literales con __proto__
// ============================================================
// Podemos hacer que un objeto herede de otro asignando su
// `__proto__`. Acá `mirtha` tiene su propio nombre y su propia
// frase, pero NO define `saludar()`: cuando la llamamos, JS no la
// encuentra en `mirtha` y la busca en su prototipo (`rosa`), que
// sí la tiene. A esto se lo llama "cadena de prototipos": la
// búsqueda de una propiedad sube de un objeto a su prototipo hasta
// encontrarla (o hasta llegar a null).

const rosa = {
  nombre: 'Rosa',
  apellido: 'Martínez',
  edad: 25,
  saludar() {
    return `Hola, soy ${this.nombre} ${this.apellido}`;
  },
};

const mirtha = {
  nombre: 'Mirtha',
  apellido: 'Legrand',
  frase: 'Como te ven, te tratan.',
  decirFrase() {
    return `"${this.frase}". ${this.nombre} ${this.apellido}`;
  },
  __proto__: rosa,
};

console.log(`${rosa.nombre} dice:\n${rosa.saludar()}`);
console.log();

console.log(`${mirtha.nombre} saluda:\n${mirtha.saludar()}\ny dice: ${mirtha.decirFrase()}`);
console.log();

console.log(`el prototipo de rosa es: ${JSON.stringify(rosa.__proto__)}`);
console.log(`el prototipo de mirtha es: ${JSON.stringify(mirtha.__proto__)}`);

console.log(`¿mirtha.__proto__ es rosa? ${rosa === mirtha.__proto__}`);
console.log(`el prototipo del prototipo de mirtha es: ${JSON.stringify(mirtha.__proto__.__proto__)}`);
console.log(
  `el prototipo del prototipo del prototipo de mirtha es: ${JSON.stringify(mirtha.__proto__.__proto__.__proto__)}`
);
