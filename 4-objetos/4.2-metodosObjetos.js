'use strict';
console.clear();

const person = {
  firstName: 'Alguien',
  lastName: 'Aleatorio',
  birthDate: new Date('1988-04-17'),
  getAge() {
    return Math.floor((Date.now() - this.birthDate.getTime()) / 3.15576e10);
  },
  getAgeToDate(someDate) {
    return Math.floor((someDate.getTime() - this.birthDate.getTime()) / 3.15576e10);
  },
  hobbies: ['leer', 'surfear', 'programar'],
  address: {
    street: 'Zeballos 1341',
    city: {
      zip: 2000,
      name: 'Rosario',
    },
    state: {
      code: 63,
      name: 'Provincia de Santa Fe',
    },
    country: 'Argentina',
    getFullAddress() {
      return `${this.street}, ${this.city.name}, ${this.state.name}, ${this.country}`;
    },
  },
};

console.log(person.address.getFullAddress());
console.log(person.getAge());
console.log(person.getAgeToDate(new Date('2022-12-18')));
console.log('address' in person);
delete person.address;
console.log('address' in person);
