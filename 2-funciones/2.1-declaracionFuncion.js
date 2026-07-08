'use strict';
console.clear();

// ============================================================
// DECLARACIÓN DE FUNCIONES (function declaration)
// ============================================================
// La forma más clásica de definir una función: la palabra
// "function", un nombre, sus parámetros y el cuerpo.
// - Un parámetro puede tener un VALOR POR DEFECTO (saludo = 'Hola'):
//   se usa cuando no se pasa ese argumento.
// - En JS los parámetros no son obligatorios: si falta uno, vale
//   undefined (salvo que tenga un valor por defecto).
// - El orden de los argumentos importa, y los de más se ignoran.

function saludar(nombre, saludo = 'Hola') {
  return `${saludo} ${nombre}`;
}

const otroSaludo = saludar('Nombrecito', 'Hola amigo') // El resultado de la función se puede guardar en una variable para usarlo después

console.log(otroSaludo);
console.log(saludar('Juan', 'Buen día')); // Cambio el saludo por defecto por uno personalizado
console.log(saludar('Juan')); // los parámetros son opcionales pero pueden tener un valor por defecto
console.log(saludar()); // los parámetros no pueden ser obligatorios
console.log(saludar('Hola', 'Juan')); // el orden importa
console.log(saludar('Juan', 'Hola', '!')); // los parámetros adicionales se ignoran
