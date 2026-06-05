const datos = ['array', 1, true, undefined, 'historia'];

console.log('for');
for (let i = 0; i < datos.length; i++) {
  const element = datos[i];
  console.log(`el elemento ${i} es ${element} de tipo ${typeof element}`);
}

console.log('forEach');
datos.forEach((element, i) => {
  console.log(`el elemento ${i} es ${element} de tipo ${typeof element}`);
});
