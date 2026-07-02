'use strict';
console.clear();

// ============================================================
// SCOPE (alcance de las variables)
// ============================================================
// El scope define DÓNDE "se ve" una variable.
// - Scope global: x e y se declaran afuera; se ven en todo el archivo.
// - Scope local (de función): la x de adentro de withVars() es OTRA
//   variable distinta, solo existe ahí y "tapa" a la global (shadowing).
// - Desde adentro de una función SÍ se pueden leer las variables de
//   afuera (por eso withVars() puede leer la y global).

let x = 1;          // x global
let y = 'prueba';   // y global
withVars();

function withVars() {
  let x = 'a';        // x LOCAL: distinta de la global, la tapa acá adentro
  console.log(x, y);  // 'a' 'prueba'  -> x local, y global
}

console.log(x, y);    // 1 'prueba'    -> x global: nunca cambió
