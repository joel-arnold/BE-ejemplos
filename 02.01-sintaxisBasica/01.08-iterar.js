const datos = ['array', 1, true, undefined, 'historia'];

console.log('\nfor');
for (let i = 0; i < datos.length; i++) {
  const element = datos[i];
  console.log(`el elemento ${i} es ${element} de tipo ${typeof element}`);
}

console.log('\nforEach');
datos.forEach((element, i) => {
  console.log(`el elemento ${i} es ${element} de tipo ${typeof element}`);
});

console.log('\nfor...of');
for (const element of datos) {
  console.log(`el elemento es ${element} de tipo ${typeof element}`);
}

console.log('\nfor...in');
for (const i in datos) {
  const element = datos[i];
  console.log(`el elemento ${i} es ${element} de tipo ${typeof element}`);
}