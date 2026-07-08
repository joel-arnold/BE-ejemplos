'use strict';

// ============================================================================
// FUNCIONES DE ORDEN SUPERIOR - Ejemplos progresivos
// ============================================================================
// Una función de orden superior es aquella que recibe una función como
// parámetro y/o devuelve una función como resultado.
// ============================================================================

console.clear();

// ============================================================================
// NIVEL 1: Concepto básico - Una función que recibe otra función
// ============================================================================

console.log('=== NIVEL 1: Función que recibe una función como parámetro ===\n');

// Una función simple que recibe otra función y la aplica
function aplicar(valor, operacion) {
  return operacion(valor);
}

// Definimos operaciones (funciones simples)
function duplicar(n) {
  return n * 2;
}

function triplicar(n) {
  return n * 3;
}

function alCuadrado(n) {
  return n * n;
}

// Usamos la función de orden superior con diferentes operaciones
console.log(`aplicar(5, duplicar) = ${aplicar(5, duplicar)}`);        // 10
console.log(`aplicar(5, triplicar) = ${aplicar(5, triplicar)}`);      // 15
console.log(`aplicar(5, alCuadrado) = ${aplicar(5, alCuadrado)}`);    // 25
console.log();

// ============================================================================
// NIVEL 2: Función de orden superior más útil - procesar arrays
// ============================================================================

console.log('=== NIVEL 2: Procesar un array con diferentes operaciones ===\n');

// Una función que recibe un arreglo y una operación, y aplica esa operación
// a cada elemento
function procesarArreglo(arreglo, operacion) {
  const resultado = [];
  for (let i = 0; i < arreglo.length; i++) {
    resultado.push(operacion(arreglo[i]));
  }
  return resultado;
}

const numeros = [1, 2, 3, 4, 5];

console.log(`Arreglo original: [${numeros}]`);
console.log(`Duplicados:       [${procesarArreglo(numeros, duplicar)}]`);
console.log(`Triplicados:      [${procesarArreglo(numeros, triplicar)}]`);
console.log(`Al cuadrado:      [${procesarArreglo(numeros, alCuadrado)}]`);
console.log();

// ============================================================================
// NIVEL 3: Usando funciones anónimas (sin nombrarlas previamente)
// ============================================================================

console.log('=== NIVEL 3: Usando funciones anónimas en el llamado ===\n');

const temperaturas = [20, 25, 30, 15, 28];

// En lugar de pasar una función predefinida, podemos pasar una función
// anónima directamente
const enFahrenheit = procesarArreglo(temperaturas, function(celsius) {
  return (celsius * 9/5) + 32;
});

console.log(`Temperaturas en °C: [${temperaturas}]`);
console.log(`Temperaturas en °F: [${enFahrenheit}]`);
console.log();

// ============================================================================
// NIVEL 4: Casos reales de la API de JavaScript (funciones de orden superior)
// ============================================================================

console.log('=== NIVEL 4: Funciones de orden superior en la API de JS ===\n');

const edades = [15, 25, 8, 35, 12, 45, 30];

// Array.map() es una función de orden superior
const edadesDobladas = edades.map(function(edad) {
  return edad * 2;
});
console.log(`Edades originales: [${edades}]`);
console.log(`Edades duplicadas: [${edadesDobladas}]`);
console.log();

// Array.filter() es una función de orden superior
const mayoresDeEdad = edades.filter(function(edad) {
  return edad >= 18;
});
console.log(`Mayores de edad: [${mayoresDeEdad}]`);
console.log();

// Array.reduce() es una función de orden superior
const sumaEdades = edades.reduce(function(acumulador, edad) {
  return acumulador + edad;
}, 0);
console.log(`Suma de edades: ${sumaEdades}`);
console.log(`Promedio de edades: ${sumaEdades / edades.length}`);
console.log();

// ============================================================================
// NIVEL 5: Crear nuestra propia función de orden superior más compleja
// ============================================================================

console.log('=== NIVEL 5: Función de orden superior personalizada ===\n');

// Una función que recibe dos funciones: una para filtrar y otra para transformar
function procesarConFiltro(array, filtro, transformacion) {
  return array
    .filter(filtro)
    .map(transformacion);
}

const productos = [
  { nombre: 'Notebook', precio: 1000, stock: 5 },
  { nombre: 'Mouse', precio: 25, stock: 0 },
  { nombre: 'Teclado', precio: 75, stock: 12 },
  { nombre: 'Monitor', precio: 300, stock: 0 },
  { nombre: 'Auriculares', precio: 150, stock: 3 }
];

// Obtener solo los productos disponibles (stock > 0) y mostrar su nombre
const productosDisponibles = procesarConFiltro(
  productos,
  function(producto) { return producto.stock > 0; },
  function(producto) { return producto.nombre; }
);

console.log(`Productos disponibles: [${productosDisponibles.join(', ')}]`);
console.log();

// Obtener solo productos caros (>100) con descuento del 10%
const productosCarosConDescuento = procesarConFiltro(
  productos,
  function(producto) { return producto.precio > 100; },
  function(producto) {
    return {
      nombre: producto.nombre,
      precioOriginal: producto.precio,
      precioConDescuento: producto.precio * 0.9
    };
  }
);

console.log('Productos caros con 10% descuento:');
productosCarosConDescuento.forEach(function(prod) {
  console.log(`  ${prod.nombre}: $${prod.precioOriginal} → $${prod.precioConDescuento}`);
});
console.log();

// ============================================================================
// NIVEL 6: Función que DEVUELVE otra función (retorna una función)
// ============================================================================

console.log('=== NIVEL 6: Función que devuelve otra función ===\n');

// Una función que devuelve una función personalizada (factory pattern)
function crearMultiplicador(factor) {
  // Esta función DEVUELVE una función
  return function(numero) {
    return numero * factor;
  };
}

// Creamos varias funciones especializadas
const por2 = crearMultiplicador(2);
const por5 = crearMultiplicador(5);
const por10 = crearMultiplicador(10);

console.log(`Funciones creadas por crearMultiplicador():`);
console.log(`por2(7) = ${por2(7)}`);
console.log(`por5(7) = ${por5(7)}`);
console.log(`por10(7) = ${por10(7)}`);
console.log();

// ============================================================================
// RESUMEN: Por qué las funciones de orden superior son importantes
// ============================================================================

console.log('=== RESUMEN ===\n');
console.log('Las funciones de orden superior permiten:');
console.log('  1. Reutilizar código de manera flexible');
console.log('  2. Pasar comportamiento como un parámetro');
console.log('  3. Crear funciones especializadas dinámicamente');
console.log('  4. Escribir código más limpio y expresivo');
console.log('\nEjemplos en la API de JS: map(), filter(), reduce(),');
console.log('setTimeout(), addEventListener(), .then(), etc.');