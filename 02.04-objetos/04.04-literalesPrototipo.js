'use strict';
console.clear();

const sam = {
  firstName: 'Sam',
  lastName: 'Clemens',
  age: 25,
  greet() {
    return `Hola, soy ${this.firstName} ${this.lastName}`;
  },
};

const mark = {
  firstName: 'Mark',
  lastName: 'Twain',
  quote: 'Nunca discutas con estúpidos, te arrastrarán a su nivel y allí te ganarán por experiencia.',
  sayQuote() {
    return `"${this.quote}". ${this.firstName} ${this.lastName}`;
  },
  __proto__: sam,
};

console.log(`${sam.firstName} dice:\n${sam.greet()}`);
console.log();

console.log(`${mark.firstName} saluda:\n${mark.greet()}\ny dice: ${mark.sayQuote()}`);
console.log();

console.log(`el prototipo de sam es: ${JSON.stringify(sam.__proto__)}`);
console.log(`el prototipo de mark es: ${JSON.stringify(mark.__proto__)}`);

console.log(`¿mark.__proto__ es sam? ${sam === mark.__proto__}`);
console.log(`el prototipo del prototipo de mark es: ${JSON.stringify(mark.__proto__.__proto__)}`);
console.log(
  `el prototipo del prototipo del prototipo de mark es: ${JSON.stringify(mark.__proto__.__proto__.__proto__)}`
);
