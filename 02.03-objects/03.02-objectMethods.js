const person = {
  firstName: 'Alguien',
  lastName: 'Aleatorio',
  birthDate: new Date('1993-01-10'),
  getAge() {
    return Math.floor((Date.now() - this.birthDate.getTime()) / 3.15576e10);
  },
  getAgeToDate(someDate) {
    return Math.floor((someDate.getTime() - this.birthDate.getTime()) / 3.15576e10);
  },
  hobbies: ['leer', 'surfear', 'programar'],
  address: {
    street: 'Av. Mountain view 123',
    city: {
      zip: 816015,
      name: 'Kunlun',
    },
    state: {
      code: 63,
      name: 'Provincia de Qinghai',
    },
    country: 'China',
    getFullAddress() {
      return `${this.street}, ${this.city.name}, ${this.state.name}, ${this.country}`;
    },
  },
};

console.log(person.address.getFullAddress());
console.log(person.getAge());
console.log(person.getAgeToDate(new Date('2020-01-01')));
