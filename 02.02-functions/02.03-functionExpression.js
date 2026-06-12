'use strict';
console.clear();

const saludar = function decirHola(nombre, saludo = 'Hola') {
  return `${saludo} ${nombre}`;
};

const saludoAnonimo = function (nombre, saludo = 'Hola') {
  return `${saludo} ${nombre}`;
};

console.log(saludar('Juana', 'Buen día'));
console.log(saludoAnonimo('Josué', 'Buen día'));
// console.log(decirHola('Juana', 'Buen día')); // descomentar para ver el error: decirHola no es accesible fuera de la expresión
