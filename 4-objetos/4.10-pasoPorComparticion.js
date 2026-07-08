'use strict';

// ============================================================
// Pasar argumentos a una función
// ============================================================
// Cuando llamamos a una función le pasamos argumentos: pueden ser
// primitivos (un booleano, un número) o un objeto. En JavaScript,
// los objetos se pasan "por compartición" (call-by-sharing): la
// función recibe una REFERENCIA al mismo objeto, no una copia. Por
// eso, si la función modifica sus propiedades, el cambio se ve
// afuera (esto se demuestra en 4.11).
// Acá `mostrar` recibe un flag, una cantidad y el objeto a imprimir,
// y lo muestra tantas veces como se le indique.

const sePuedeMostrar = true;
const repeticiones = 2;
const persona = {
  nombre: 'Rosa',
  apellido: 'Martínez',
};
mostrar(sePuedeMostrar, repeticiones, persona);

function mostrar(mostrarEnConsola, veces, objetoAMostrar) {
  if (mostrarEnConsola) {
    for (let i = 1; i <= veces; i++) {
      console.log(`${i} de ${veces}: ${JSON.stringify(objetoAMostrar)}`);
    }
  }
}
