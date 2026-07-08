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

console.log(`${sam.firstName} dice:\n${sam.greet()}`);

console.log(`el prototipo de sam es: ${JSON.stringify(sam.__proto__)}`);

console.log(Object.prototype == sam.__proto__);

console.log(`el prototipo del prototipo de sam es: ${JSON.stringify(sam.__proto__.__proto__)}`);
