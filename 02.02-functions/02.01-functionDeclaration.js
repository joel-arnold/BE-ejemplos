'use strict';

function sayHi(name, greeting = 'Hola') {
  return `${greeting} ${name}`;
}

console.log(sayHi('Juan', 'Buen día'));
console.log(sayHi('Juan')); // los parámetros son opcionales pero pueden tener un valor por defecto
console.log(sayHi()); // los parámetros no pueden ser obligatorios
console.log(sayHi('Hola', 'Juan')); // el orden importa
console.log(sayHi('Juan', 'Hola', '!')); // los parámetros adicionales se ignoran
