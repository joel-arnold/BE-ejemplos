// ============================================================
// forEach : tres formas de pasarle la función
// ============================================================
// `forEach` recibe una función y la ejecuta por cada elemento del
// arreglo. Esa función se le puede pasar de distintas maneras, y
// todas son equivalentes:
// - una función ya definida (pasamos su nombre, sin paréntesis).
// - una función anónima creada en el momento.
// - una función flecha (arrow function), la forma más corta.

const datos = ['arreglo', 1, true, undefined, 'historia'];

function mostrar(elemento) {
  console.log(elemento);
}

console.log('\nusando una función ya definida');
datos.forEach(mostrar);

console.log('\ncreando la función');
datos.forEach(function (elemento) {
  console.log(elemento);
});

console.log('\nfunción flecha');
datos.forEach((elemento) => console.log(elemento));
