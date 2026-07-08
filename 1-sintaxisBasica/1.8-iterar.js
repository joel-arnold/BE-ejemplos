// ============================================================
// Formas de recorrer un arreglo
// ============================================================
// JS ofrece varias maneras de iterar. Conviene conocer las
// diferencias:
// - `for` clásico: control total con un índice numérico.
// - `forEach`: ejecuta una función por cada elemento (valor, índice).
// - `for...of`: recorre los VALORES directamente (lo más cómodo
//   para leer los elementos).
// - `for...in`: recorre las CLAVES/índices (como texto). Pensado
//   para objetos; en arreglos conviene evitarlo.

const datos = ['arreglo', 1, true, undefined, 'historia'];

console.log('\nfor');
for (let i = 0; i < datos.length; i++) {
  const elemento = datos[i];
  console.log(`el elemento ${i} es ${elemento} de tipo ${typeof elemento}`);
}

console.log('\nforEach');
datos.forEach((elemento, i) => {
  console.log(`el elemento ${i} es ${elemento} de tipo ${typeof elemento}`);
});

console.log('\nfor...of');
for (const elemento of datos) {
  console.log(`el elemento es ${elemento} de tipo ${typeof elemento}`);
}

console.log('\nfor...in');
for (const i in datos) {
  const elemento = datos[i];
  console.log(`el elemento ${i} es ${elemento} de tipo ${typeof elemento}`);
}
