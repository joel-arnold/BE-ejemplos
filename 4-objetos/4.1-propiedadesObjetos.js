'use strict';
console.clear();

const person = {
  firstName: 'Alguien',
  lastName: 'Aleatorio',
  age: 30,
  hobbies: ['leer', 'surfear', 'programar'],
  address: {
    street: 'Calle Falsa 123',
    city: {
      zip: 2000,
      name: 'Rosario',
    },
    state: {
      code: 21,
      name: 'Provincia de Santa Fe',
    },
    country: 'Argentina',
  },
};

console.log('notación de punto');
console.log(`${person.firstName} vive en ${person.address.city.name} y tiene ${person.age} años`);

console.log('cambiar edad');
person.age = 31;
console.log(`${person.firstName} vive en ${person.address.city.name} y tiene ${person.age} años`);

console.log('notación de corchetes');
person['age'] = 40;
console.log(`${person['firstName']} vive en ${person['address']['city']['name']} y tiene ${person['age']} años`);

console.log('crear propiedades');
person.job = 'programador web';
console.log(
  `${person['firstName']} vive en ${person['address']['city']['name']}, tiene ${person['age']} años y trabaja como ${person.job}`
);
