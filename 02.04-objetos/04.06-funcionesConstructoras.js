'use strict';

function Person(firstName, lastName, age) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
}

Person.prototype.greet = function () {
  return `Hola, soy ${this.firstName} ${this.lastName}`;
};

const sam = new Person('Sam', 'Clemens', 25);

console.log(`${sam.firstName} dice:\n${sam.greet()}`);
console.log();
console.log('prototipo del objeto');
console.log(`¿sam.__proto__ es Person? ${sam.__proto__ === Person}`);
console.log(`¿sam.__proto__ es Person.__proto__? ${sam.__proto__ === Person.__proto__}`);
console.log(`¿sam.__proto__ es Person.prototype? ${sam.__proto__ === Person.prototype}`);

console.log();
console.log('prototipo de Person');
console.log(`¿Person.__proto__ es Person.prototype? ${Person.__proto__ === Person.prototype}`);
console.log(`¿Person.__proto__ es Function.prototype? ${Person.__proto__ === Function.prototype}`);
console.log(`¿Person.prototype es Object.prototype? ${Person.prototype === Object.prototype}`);
console.log(`¿Person.prototype.__proto__ es Object.prototype? ${Person.prototype.__proto__ === Object.prototype}`);
