'use strict';
console.clear();

// ============================================================
// EJECUCIÓN ASÍNCRONA y EVENT LOOP
// ============================================================
// JavaScript ejecuta UNA cosa a la vez (un solo hilo). Para no
// bloquearse, delega las tareas asíncronas y sigue con el código
// sincrónico. El orden en que "vuelven" esas tareas lo decide el
// event loop, que maneja dos colas con distinta prioridad:
//
//   1) Call stack   -> el código sincrónico se ejecuta YA.
//   2) Microtareas  -> Promises (.then/.catch/.finally, await).
//                      Se vacían apenas se libera el call stack.
//   3) Macrotareas  -> setTimeout, setInterval, I/O.
//                      Se atienden DESPUÉS de las microtareas.
//
// Regla práctica: primero TODO lo sincrónico, después TODAS las
// microtareas, y recién ahí las macrotareas.

console.log("1"); // sincrónico -> se imprime primero

setTimeout(() => {
  console.log("2"); // macrotarea -> se atiende al final
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // microtarea -> antes que el setTimeout
});

console.log("4"); // sincrónico -> se imprime segundo

// ------------------------------------------------------------
// Salida:  1  4  3  2
//   1 y 4 -> sincrónico, en orden.
//   3     -> microtarea (Promise), antes que cualquier timeout.
//   2     -> macrotarea (setTimeout), aunque el delay sea 0.
//
// Aunque el setTimeout diga 0ms, las Promises SIEMPRE tienen
// prioridad. Por eso "2" queda para el final.
// ------------------------------------------------------------
