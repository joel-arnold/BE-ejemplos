const datos = ['array', 1, true, undefined, 'historia'];

function show(element) {
  console.log(element);
}

console.log('usando una función ya definida');
datos.forEach(show);

console.log('creando la función');
datos.forEach(function (element) {
  console.log(element);
});

console.log('arrow function');
datos.forEach((element) => console.log(element));
