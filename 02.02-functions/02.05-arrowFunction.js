'use strict';
console.clear();

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
