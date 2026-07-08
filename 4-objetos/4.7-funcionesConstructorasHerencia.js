'use strict';

function Person(firstName, lastName, age) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
}

Person.prototype.greet = function () {
  return `Hola, soy ${this.firstName} ${this.lastName}`;
};

function Author(firstName, lastName, age, quote) {
  Person.call(this, firstName, lastName, age);
  this.quote = quote;
}

Author.prototype = Object.create(Person.prototype);
Author.prototype.constructor = Author;

Author.prototype.sayQuote = function () {
  return `"${this.quote}". ${this.firstName} ${this.lastName}`;
};

const sam = new Person('Sam', 'Clemens', 25);
const mark = new Author(
  'Mark',
  'Twain',
  25,
  'Nunca discutas con estúpidos, te arrastrarán a su nivel y allí te ganarán por experiencia.'
);

console.log(`${sam.firstName} dice:\n${sam.greet()}`);
console.log();
console.log(`${mark.firstName} saluda:\n${mark.greet()}\ny dice: ${mark.sayQuote()}`);

console.log();
console.log('prototipo del objeto');
console.log(`¿mark.__proto__ es Author.prototype? ${mark.__proto__ === Author.prototype}`);
console.log(`¿mark.__proto__.__proto__ es Person.prototype? ${mark.__proto__.__proto__ === Person.prototype}`);
console.log(`¿mark.__proto__.__proto__ es sam.__proto__? ${mark.__proto__.__proto__ === sam.__proto__}`);

console.log();
console.log(`¿Author.__proto__ es Person? ${Author.__proto__ === Person}`);
console.log(`¿Author.__proto__.__proto__ es Person? ${Author.__proto__.__proto__ === Person}`);
console.log(`¿Author.__proto__ es Function.prototype? ${Author.__proto__ === Function.prototype}`);

console.log(`¿Author.__proto__ es Person.__proto__? ${Author.__proto__ === Person.__proto__}`);

console.log(`¿Author.prototype.__proto__ es Person.prototype? ${Author.prototype.__proto__ === Person.prototype}`);
