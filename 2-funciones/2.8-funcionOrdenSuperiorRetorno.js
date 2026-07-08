'use strict';
console.clear();

// ============================================================================
// FUNCIONES DE ORDEN SUPERIOR: Funciones que DEVUELVEN funciones
// ============================================================================
// Este archivo cubre el segundo caso de las higher-order functions:
// una función que, al ejecutarse, genera y devuelve una función nueva.
//
// Esto es útil cuando queremos crear funciones "especializadas" a partir
// de una función más general.
// ============================================================================


// ============================================================================
// EJEMPLO 1: Saludo personalizado
// ============================================================================
// El caso más simple: una función que configura y devuelve otra función.

console.log('=== EJEMPLO 1: Saludo personalizado ===\n');

function crearSaludo(saludo) {
  // Devuelve una función que ya "recuerda" el saludo elegido
  return function(nombre) {
    return `${saludo}, ${nombre}!`;
  };
}

const saludarFormal = crearSaludo('Buenos días');
const saludarInformal = crearSaludo('Hola');
const saludarIngles = crearSaludo('Hello');

console.log(saludarFormal('Dr. García'));      // Buenos días, Dr. García!
console.log(saludarInformal('Marcos'));        // Hola, Marcos!
console.log(saludarIngles('John'));            // Hello, John!
console.log();

// Las tres funciones se crearon a partir de la misma "fábrica"
// pero cada una tiene su propio comportamiento configurado.

// ============================================================================
// EJEMPLO 2: Generador de descuentos
// ============================================================================
// Una función que devuelve funciones para aplicar descuentos específicos.

console.log('=== EJEMPLO 2: Generador de descuentos ===\n');

function crearDescuento(porcentaje) {
  return function(precio) {
    const descuento = precio * (porcentaje / 100);
    const precioFinal = precio - descuento;
    return {
      precioOriginal: precio,
      descuento: descuento,
      precioFinal: precioFinal
    };
  };
}

const descuento10 = crearDescuento(10);
const descuento25 = crearDescuento(25);
const descuento50 = crearDescuento(50);

const precio = 1000;

console.log(`Precio original: $${precio}`);
console.log('Descuento 10%:', descuento10(precio));
console.log('Descuento 25%:', descuento25(precio));
console.log('Descuento 50%:', descuento50(precio));
console.log();

// ============================================================================
// EJEMPLO 3: Validadores configurables
// ============================================================================
// Una función que devuelve validadores con reglas específicas.
// Patrón muy usado en formularios y APIs.

console.log('=== EJEMPLO 3: Validadores configurables ===\n');

function crearValidadorLongitud(min, max) {
  return function(texto) {
    if (texto.length < min) {
      return `Muy corto: mínimo ${min} caracteres (tiene ${texto.length})`;
    }
    if (texto.length > max) {
      return `Muy largo: máximo ${max} caracteres (tiene ${texto.length})`;
    }
    return 'OK';
  };
}

const validarNombre = crearValidadorLongitud(2, 50);
const validarPassword = crearValidadorLongitud(8, 20);
const validarUsername = crearValidadorLongitud(4, 15);

const nombres = ['Al', 'Juan', 'A'];
const passwords = ['abc', 'miPassword123', 'contraseñademasiadalarga!!!'];
const usernames = ['jo', 'joel_dev', 'nombre_de_usuario_muy_largo'];

console.log('--- Validación de nombres ---');
nombres.forEach(function(n) {
  console.log(`  "${n}": ${validarNombre(n)}`);
});

console.log('--- Validación de passwords ---');
passwords.forEach(function(p) {
  console.log(`  "${p}": ${validarPassword(p)}`);
});

console.log('--- Validación de usernames ---');
usernames.forEach(function(u) {
  console.log(`  "${u}": ${validarUsername(u)}`);
});
console.log();

// ============================================================================
// EJEMPLO 4: Multiplicador y operaciones matemáticas
// ============================================================================
// Cómo combinar una función "fábrica" con map() de la API de JS.

console.log('=== EJEMPLO 4: Combinando con map() ===\n');

function crearOperacion(operador, valor) {
  return function(n) {
    switch(operador) {
      case '+': return n + valor;
      case '-': return n - valor;
      case '*': return n * valor;
      case '/': return n / valor;
      default:  return n;
    }
  };
}

const sumarIVA = crearOperacion('*', 1.21);   // +21% IVA
const aplicarBonificacion = crearOperacion('-', 50); // -$50 fijo
const duplicar = crearOperacion('*', 2);

const precios = [100, 250, 75, 430, 15];

console.log(`Precios base:             [${precios}]`);
console.log(`Con IVA (21%):            [${precios.map(sumarIVA).map(p => Math.round(p))}]`);
console.log(`Con bonificación (-$50):  [${precios.map(aplicarBonificacion)}]`);
console.log(`Duplicados:               [${precios.map(duplicar)}]`);
console.log();

// ============================================================================
// SÍNTESIS: ¿Por qué devolver una función?
// ============================================================================

console.log('=== SÍNTESIS ===\n');
console.log('Devolver una función desde otra función permite:');
console.log();
console.log('  1. CONFIGURAR comportamiento una sola vez y reutilizarlo.');
console.log('     crearDescuento(10) → aplicar en 100 productos distintos');
console.log();
console.log('  2. ESPECIALIZAR una función general.');
console.log('     crearValidadorLongitud(8, 20) → validador para passwords');
console.log('     crearValidadorLongitud(2, 50) → validador para nombres');
console.log();
console.log('  3. ENCAPSULAR lógica que no cambia.');
console.log('     El porcentaje de IVA queda "guardado" dentro de sumarIVA.');
console.log('     No hay que repetirlo en cada llamada.');