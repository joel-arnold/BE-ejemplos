'use strict';
console.clear();

// ============================================================
// EXPRESIÓN DE FUNCIÓN (function expression)
// ============================================================
// Es cuando una función se ASIGNA a una variable. Puede ser:
// - con nombre (function decirHola...): ese nombre interno SOLO
//   es accesible dentro de la propia función (útil para recursión).
// - anónima (function (...) { }): sin nombre propio.
// Para usarla nos referimos al nombre de la VARIABLE (saludar),
// no al nombre interno (decirHola).

const saludar = function decirHola(nombre, saludo = 'Hola') {
  return `${saludo} ${nombre}`;
};

const saludoAnonimo = function (nombre, saludo = 'Hola') {
  return `${saludo} ${nombre}`;
};

console.log(saludar('Juana', 'Buen día'));
console.log(saludoAnonimo('Josué', 'Buen día'));
// console.log(decirHola('Juana', 'Buen día')); // descomentar para ver el error: decirHola no es accesible fuera de la expresión
