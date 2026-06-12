'use strict';
console.clear();

function sayHi(name, greeting = 'Hola') {
  return `${greeting} ${name}`;
}

const otroSaludo = sayHi('Nombrecito', 'Hola amigo') // El resultado de la función se puede guardar en una variable para usarlo después

console.log(otroSaludo);
console.log(sayHi('Juan', 'Buen día')); // Cambio el saludo por defecto por uno personalizado
console.log(sayHi('Juan')); // los parámetros son opcionales pero pueden tener un valor por defecto
console.log(sayHi()); // los parámetros no pueden ser obligatorios
console.log(sayHi('Hola', 'Juan')); // el orden importa
console.log(sayHi('Juan', 'Hola', '!')); // los parámetros adicionales se ignoran
