'use strict';
console.clear();

// ============================================================
// Array.forEach() : recorrer un array con una función
// ============================================================
// forEach es una función de orden superior: recibe una función y
// la ejecuta UNA VEZ por cada elemento del array, pasándole
// (valor, índice). Sirve para hacer algo con cada elemento (acá,
// imprimirlo). No devuelve un array nuevo (para eso está map()).

const palabras = ['Hola a todos', 'estas son', 'funciones de orden superior'];

const funcionOrdenSuperior = (valor, indice) =>
  console.log(
    `El valor en la posición ${indice + 1}° es '${valor}' y el espacio en blanco es el ${
      valor.indexOf(' ') + 1
    }° caracter de la oración`
  );

palabras.forEach(funcionOrdenSuperior);
console.log();
palabras.forEach((valor, indice) =>
  console.log(`El elemento ${indice + 1}° tiene un espacio en blanco en la posición ${valor.indexOf(' ') + 1}°`)
);
