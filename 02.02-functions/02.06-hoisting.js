'use strict';
console.clear();

// ============================================================
// HOISTING (elevación)
// ============================================================
// JS "eleva" las DECLARACIONES de función al tope de su scope: por
// eso podemos llamar a hoisting() ANTES de la línea donde se escribe.
// En cambio, una función guardada en una const (expresión) NO se
// eleva: si la llamás antes de definirla, falla.
// (Descomentá la línea de noHoisting para ver el error.)

hoisting('esto es hoisting');
// noHoisting('esto no es hoisting'); // descomentar para ver el error

function hoisting(printText) {
  console.log(printText);
}

const noHoisting = function (printText) {
  console.log(printText);
};
