// ============================================================
// Bucles: while, do...while y for
// ============================================================
// Un bucle repite un bloque de código mientras se cumpla una
// condición. Las tres variantes clásicas:
// - `while`: evalúa la condición ANTES de cada vuelta; si arranca
//   en false, no se ejecuta ninguna vez.
// - `do...while`: ejecuta el bloque PRIMERO y evalúa la condición
//   DESPUÉS; por eso corre al menos una vez, aunque sea false.
// - `for`: junta en una línea la inicialización, la condición y el
//   incremento. Ideal cuando sabemos cuántas veces repetir.

let i = 0;
let j = 0;

console.log('while');
while (i < 3) {
  console.log(`i es ${i}, entonces i<3 es ${i < 3}`);
  i++;
}

console.log('do...while');
do {
  console.log(`j es ${j}, entonces j<0 es ${j < 0} pero se ejecutó una vez`);
} while (j < 0);

console.log('for');

for (let k = 0; k < 3; k++) {
  console.log(`k es ${k}, entonces k<3 es ${k < 3}`);
}
