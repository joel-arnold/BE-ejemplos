const datos = ['array', 1, true, undefined, 'historia'];

function show(element) {
  console.log(element);
}

console.log('\nusando una función ya definida');
datos.forEach(show);

console.log('\ncreando la función');
datos.forEach(function (element) {
  console.log(element);
});

console.log('\narrow function');
datos.forEach((element) => console.log(element));
