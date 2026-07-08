let array = [1, true, 'historia'];

console.log(`el array contiene ${array}`);
console.log(`el primer elemento del array es ${array[0]}`);
console.log(`el segundo elemento del array es ${array.at(1)}`);
console.log(`el último elemento del array (desde el final) es ${array.at(-1)}`);
console.log(`la longitud del array es ${array.length}`);
console.log(`exceder el tamaño máximo de un array no lanza un error, devuelve: ${array[3]}`);

array[5] = 'último';
console.log(`los arrays no son densos, pueden tener espacios vacíos: ${array}`);
