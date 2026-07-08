// ============================================================
// Igualdad: == (débil) vs === (estricta)
// ============================================================
// - `==` compara valores pero PERMITE la conversión de tipos
//   (coerción): 1 == '1' es true porque convierte el texto a número.
// - `===` compara valor Y tipo, sin conversión: 1 === '1' es false.
// Lo mismo aplica a la desigualdad (`!=` vs `!==`).
// Recomendación: usar SIEMPRE la versión estricta (=== y !==) para
// evitar sorpresas por conversiones automáticas.

console.log(`igualdad 1=='1': ${1 == '1'}`);
console.log(`igualdad estricta 1==='1': ${1 === '1'}`);

console.log(`desigualdad 1!='1': ${1 != '1'}`);
console.log(`desigualdad estricta 1!=='1': ${1 !== '1'}`);
