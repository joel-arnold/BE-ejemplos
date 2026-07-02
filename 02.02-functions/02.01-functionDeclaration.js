'use strict';
console.clear();

// ============================================================
// DECLARACIÓN DE FUNCIONES (function declaration)
// ============================================================
// La forma más clásica de definir una función: la palabra
// "function", un nombre, sus parámetros y el cuerpo.
// - Un parámetro puede tener un VALOR POR DEFECTO (greeting = 'Hola'):
//   se usa cuando no se pasa ese argumento.
// - En JS los parámetros no son obligatorios: si falta uno, vale
//   undefined (salvo que tenga un valor por defecto).
// - El orden de los argumentos importa, y los de más se ignoran.

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
