'use strict';

const Person = {
  init(firstName, lastName, age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.greet = function () {
      return `Hola, soy ${this.firstName} ${this.lastName}`;
    };
  },
};

const Author = {
  __proto__: Person,
  init(firstName, lastName, age, quote) {
    Person.init.call(this, firstName, lastName, age);
    this.quote = quote;
    this.sayQuote = function () {
      return `"${this.quote}". ${this.firstName} ${this.lastName}`;
    };
  },
};

const sam = Object.create(Person);
sam.init('Sam', 'Clemens', 25);

const mark = Object.create(Author);
mark.init(
  'Mark',
  'Twain',
  25,
  'Nunca discutas con estúpidos, te arrastrarán a su nivel y allí te ganarán por experiencia.'
);

console.log(`${sam.firstName} dice:\n${sam.greet()}`);
console.log();
console.log(`${mark.firstName} saluda:\n${mark.greet()}\ny dice: ${mark.sayQuote()}`);
console.log();

console.log(`¿sam.__proto__ es Person? ${sam.__proto__ === Person}`);
console.log(`¿Person.__proto__ es Object.prototype? ${Person.__proto__ === Object.prototype}`);
console.log(`Person.prototype: ${Person.prototype}`);

console.log(`¿mark.__proto__ es Author? ${mark.__proto__ === Author}`);
console.log(`¿mark.__proto__.__proto__ es Person? ${mark.__proto__.__proto__ === Person}`);
console.log(`¿Author.__proto__ es Person? ${Author.__proto__ === Person}`);
