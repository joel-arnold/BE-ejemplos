class Person {
  email;
  #birthDate; // Propiedad privada - debe ser declarada antes del constructor

  constructor(firstName, lastName, birthDate) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.#birthDate = birthDate;
    this.age = Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  greet() {
    return `Hola, mi nombre es ${this.getFullName()}, tengo ${this.age} años.`;
  }

  get fullName() {
    return this.getFullName();
  }

  set fullName(name) {
    const parts = name.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  }

  static createAnonymous() {
    return new Person('Juan', 'Pérez', '1990-01-01');
  }
}

const sam = new Person('Sam', 'Clemens', '1835-11-30');
console.log(sam.age); // edad calculada según la fecha actual
console.log(sam.greet()); // Hola, mi nombre es Sam Clemens, tengo N años.
// console.log(sam.#birthDate); // descomentar para ver el error: no se puede acceder a propiedades privadas desde afuera
