'use strict';

function createPerson(firstName, lastName, age) {
  return {
    firstName,
    lastName,
    age,
    greet() {
      return `Hola, soy ${this.firstName} ${this.lastName}`;
    },
  };
}

const sam = createPerson('Sam', 'Clemens', 25);
console.log(`${sam.firstName} dice:\n${sam.greet()}`);
