'use strict';
console.clear();

// ============================================================
// FUNCIONES FLECHA (arrow functions)
// ============================================================
// Sintaxis más corta para escribir funciones.
// - Cuerpo de una sola expresión: el return es IMPLÍCITO y no
//   hacen falta llaves  ->  (nombre, saludo) => `${saludo} ${nombre}`
// - Cuerpo con llaves { }: hay que poner return explícito.
// (Además, las flecha no tienen su propio "this", pero eso se ve
//  más adelante.)

const saludar = (nombre, saludo = 'Hola') => `${saludo} ${nombre}`;

const expresionSaludoAnonima = (destinatario, saludo = 'Hola') => {
  if (typeof destinatario === 'string') {
    return `${saludo} ${destinatario}`;
  } else if (typeof destinatario === 'object') {
    return expresionSaludoAnonima(`${destinatario.nombre} ${destinatario.apellido}`, saludo);
  }
};

console.log(saludar('Juan', 'Buen día'));
console.log(expresionSaludoAnonima({ nombre: 'Juana', apellido: 'Pérez' }, 'Buen día'));
