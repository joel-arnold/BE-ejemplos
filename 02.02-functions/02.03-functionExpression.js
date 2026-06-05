'use strict';

const greet = function sayHi(name, greeting = 'Hola') {
  return `${greeting} ${name}`;
};

const anonymousGreet = function (name, greeting = 'Hola') {
  return `${greeting} ${name}`;
};

console.log(greet('Juana', 'Buen día'));
console.log(anonymousGreet('Josué', 'Buen día'));
// console.log(sayHi('Juana', 'Buen día')); // descomentar para ver el error: sayHi no es accesible fuera de la expresión
