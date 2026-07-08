// ============================================================
// Condicional if / else y valores truthy / falsy
// ============================================================
// El `if` ejecuta un bloque solo si la condición es verdadera.
// La condición no tiene por qué ser un booleano: JS convierte
// cualquier valor a true/false según su "veracidad":
// - falsy (se comportan como false): 0, '', null, undefined, NaN, false.
// - truthy (se comportan como true): casi todo lo demás.
// Por eso una variable sin valor (undefined) entra por el `else`.

let a = 1 + 2;
let b; // sin asignar -> undefined (falsy)

console.log(`typeof b: ${typeof b}`);

if (a > 3) {
  console.log('a>3 es verdadero');
} else {
  console.log('a>3 es falso');
}

if (a) {
  console.log('a es truthy');
} else {
  console.log('a es falsy');
}

if (b) {
  console.log('b es truthy');
} else {
  console.log('b es falsy');
}
