'use strict';

// ============================================================
// Modificar valores dentro de una función: objeto vs primitivos
// ============================================================
// Este ejemplo muestra la gran diferencia entre pasar un objeto y
// pasar valores primitivos a una función:
// - OBJETO (paso por compartición): la función recibe la MISMA
//   referencia. Si le cambia las propiedades, el cambio SE VE afuera.
//   Por eso, tras `ponerNombreArtistico`, `persona` queda modificada.
// - PRIMITIVOS (paso por valor): la función recibe una COPIA. Aunque
//   la reasigne adentro, la variable de afuera NO cambia.
// La idea es "convertir" a la persona (nombre real) en su nombre
// artístico, marcándola como alias.

function ponerNombreArtistico(objetoNoPrimitivo, nombreCompletoPrimitivo, edadPrimitiva, esAliasPrimitivo) {
  objetoNoPrimitivo.nombre = 'Mirtha';
  objetoNoPrimitivo.apellido = 'Legrand';
  objetoNoPrimitivo.edad = 47;
  objetoNoPrimitivo.esAlias = true;
  objetoNoPrimitivo.modificado = true;

  nombreCompletoPrimitivo = 'Mirtha Legrand';
  edadPrimitiva = 47;
  esAliasPrimitivo = true;
}

let persona = {
  nombre: 'Rosa',
  apellido: 'Martínez',
  edad: 74,
  esAlias: false,
};

let nombreCompleto = 'Rosa Martínez';
let edad = 74;
let esAlias = false;

ponerNombreArtistico(persona, nombreCompleto, edad, esAlias);

console.log(`persona: ${JSON.stringify(persona)}`); // el objeto SÍ cambió
console.log(`nombreCompleto: ${nombreCompleto}`);    // el primitivo NO cambió
console.log(`edad: ${edad}`);                        // el primitivo NO cambió
console.log(`esAlias: ${esAlias}`);                  // el primitivo NO cambió
