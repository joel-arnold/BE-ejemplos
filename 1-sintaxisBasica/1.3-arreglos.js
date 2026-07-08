// ============================================================
// Arreglos (arrays)
// ============================================================
// Un arreglo es una lista ordenada de valores. En JS puede
// contener elementos de DISTINTO tipo a la vez (números, textos,
// booleanos, etc.). Se accede a cada elemento por su índice, que
// arranca en 0. Además:
// - `.at(i)` permite índices negativos para contar desde el final.
// - `.length` es la cantidad de elementos.
// - acceder a un índice inexistente no rompe: devuelve `undefined`.
// - los arreglos no son "densos": pueden quedar huecos vacíos.

let arreglo = [1, true, 'historia'];

console.log(`el arreglo contiene ${arreglo}`);
console.log(`el primer elemento del arreglo es ${arreglo[0]}`);
console.log(`el segundo elemento del arreglo es ${arreglo.at(1)}`);
console.log(`el último elemento del arreglo (desde el final) es ${arreglo.at(-1)}`);
console.log(`la longitud del arreglo es ${arreglo.length}`);
console.log(`exceder el tamaño máximo de un arreglo no lanza un error, devuelve: ${arreglo[3]}`);

arreglo[5] = 'último';
console.log(`los arreglos no son densos, pueden tener espacios vacíos: ${arreglo}`);
