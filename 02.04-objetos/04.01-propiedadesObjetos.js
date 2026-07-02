console.clear();

const person = {
  firstName: 'Alguien',
  lastName: 'Aleatorio',
  age: 30,
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
person.job = 'desarrollador';
console.log(
  `${person['firstName']} vive en ${person['address']['city']['name']}, tiene ${person['age']} años y trabaja como ${person.job}`
);
