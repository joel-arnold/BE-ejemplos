'use strict';

const words = ['Hola a todos', 'estas son', 'funciones de orden superior'];

const highOrderFunction = (value, index) =>
  console.log(
    `El valor en la posición ${index + 1}° es '${value}' y el espacio en blanco es el ${
      value.indexOf(' ') + 1
    }° caracter de la oración`
  );

words.forEach(highOrderFunction);
console.log();
words.forEach((value, index) =>
  console.log(`El elemento ${index + 1}° tiene un espacio en blanco en la posición ${value.indexOf(' ') + 1}°`)
);
