// ============================================================================
// TIPOS BÁSICOS E INFERENCIA - Ejemplos progresivos
// ============================================================================
// La sintaxis de TypeScript es una sola cosa: dos puntos y el tipo, después
// del nombre. Todo lo demás son variantes de esa idea.
//
// Las líneas que darían error están COMENTADAS, con el mensaje que muestra el
// compilador. Descomentalas en el editor para ver el subrayado rojo.
// ============================================================================

console.clear();

// ============================================================================
// NIVEL 1: Anotar el tipo
// ============================================================================

console.log('=== NIVEL 1: Tipos primitivos ===\n');

let nombre: string = 'Teclado';
let precio: number = 25000;
let disponible: boolean = true;

console.log(`${nombre}: $${precio} (disponible: ${disponible})`);

// precio = 'muy caro';
// Error: Type 'string' is not assignable to type 'number'.

console.log();

// ============================================================================
// NIVEL 2: Inferencia - no anotes lo que TypeScript ya sabe
// ============================================================================

console.log('=== NIVEL 2: Inferencia ===\n');

// TypeScript deduce el tipo del valor inicial: anotar acá sería ruido.
const marca = 'Logitech';        // marca: string
const stock = 12;                // stock: number
const precios = [100, 200, 300]; // precios: number[]

console.log(`${marca}, stock ${stock}, precios: [${precios}]`);

// La regla práctica: anotar en los BORDES (parámetros, retornos, datos que
// entran al sistema) y dejar que la inferencia se ocupe de lo local.

console.log();

// ============================================================================
// NIVEL 3: Arrays y objetos
// ============================================================================

console.log('=== NIVEL 3: Arrays y objetos ===\n');

const nombres: string[] = ['Teclado', 'Mouse', 'Monitor'];
const matriz: number[][] = [
  [1, 2],
  [3, 4],
];

// El tipo de un objeto es su FORMA: qué propiedades tiene y de qué tipo.
const producto: { nombre: string; precio: number } = {
  nombre: 'Teclado',
  precio: 25000,
};

console.log(`nombres: [${nombres}]`);
console.log(`matriz: ${JSON.stringify(matriz)}`);
console.log(`producto: ${producto.nombre} - $${producto.precio}`);

// console.log(producto.stock);
// Error: Property 'stock' does not exist on type '{ nombre: string; precio: number; }'.

console.log();

// ============================================================================
// NIVEL 4: Uniones y tipos literales
// ============================================================================

console.log('=== NIVEL 4: Uniones y literales ===\n');

// Una unión dice "puede ser cualquiera de estos tipos".
let id: number | string = 1;
console.log(`id como number: ${id}`);
id = 'abc-123';
console.log(`id como string: ${id}`);

// Una unión de LITERALES limita los valores posibles: reemplaza a los
// "strings mágicos" desperdigados por el código.
type Estado = 'activo' | 'pausado' | 'borrado';

let estado: Estado = 'activo';
console.log(`estado: ${estado}`);

estado = 'pausado';
console.log(`estado: ${estado}`);

// estado = 'Activo';
// Error: Type '"Activo"' is not assignable to type 'Estado'.

console.log();

// ============================================================================
// NIVEL 5: Narrowing - estrechar el tipo con typeof
// ============================================================================

console.log('=== NIVEL 5: Narrowing ===\n');

// Si un valor puede ser de dos tipos, TypeScript solo deja hacer lo que sirva
// para AMBOS. Para usar lo específico de uno, hay que estrecharlo. El mismo
// typeof de la unidad de sintaxis básica, pero ahora el compilador lo lee.
function formatearId(valor: number | string): string {
  if (typeof valor === 'string') {
    return valor.toUpperCase(); // acá TS sabe que es string
  }
  return `#${valor.toFixed(0)}`; // y acá, que es number
}

console.log(`formatearId('abc-123') = ${formatearId('abc-123')}`); // ABC-123
console.log(`formatearId(42)        = ${formatearId(42)}`); // #42

console.log();

// ============================================================================
// NIVEL 6: any vs unknown - la puerta de atrás y la puerta con llave
// ============================================================================

console.log('=== NIVEL 6: any vs unknown ===\n');

const textoJson = '{"nombre":"Mouse","precio":15000}';

// any APAGA TypeScript para ese valor: todo compila y no queda ninguna garantía.
const conAny: any = JSON.parse(textoJson);
console.log(`con any: ${conAny.nombre}`);
// conAny.loQueSea().tampocoImporta;  // compila... y explota en ejecución.

// unknown dice lo mismo ("no sé qué es") pero OBLIGA a chequear antes de usar.
const conUnknown: unknown = JSON.parse(textoJson);

// console.log(conUnknown.nombre);
// Error: 'conUnknown' is of type 'unknown'.

if (typeof conUnknown === 'object' && conUnknown !== null && 'nombre' in conUnknown) {
  console.log(`con unknown (ya verificado): ${String(conUnknown.nombre)}`);
}

// Para lo que viene de afuera (JSON.parse, un body, un fetch), unknown es la
// opción correcta. Y para validarlo de verdad en ejecución: Zod (ejemplo 7.3).

console.log();

// ============================================================================
// NIVEL 7: strict - null y undefined dejan de pasar desapercibidos
// ============================================================================

console.log('=== NIVEL 7: strict ===\n');

const catalogo = [
  { id: 1, nombre: 'Teclado' },
  { id: 2, nombre: 'Mouse' },
];

const encontrado = catalogo.find((p) => p.id === 1);

// console.log(encontrado.nombre);
// Error: 'encontrado' is possibly 'undefined'.
//
// find() puede no encontrar nada. En JavaScript eso es un TypeError en
// producción; acá es un error de compilación. La solución no es apagar strict:
// es contemplar el caso.

if (!encontrado) {
  throw new Error('Producto no encontrado');
}

console.log(`encontrado: ${encontrado.nombre}`); // ahora TS sabe que existe

console.log();

// ============================================================================
// RESUMEN
// ============================================================================

console.log('=== RESUMEN ===\n');
console.log('1. La anotación es `nombre: tipo`; la inferencia evita escribirla de más.');
console.log('2. Anotá en los bordes: parámetros, retornos y datos que entran.');
console.log('3. Las uniones de literales reemplazan a los strings mágicos.');
console.log('4. typeof estrecha el tipo dentro de cada rama del if.');
console.log('5. any apaga el chequeo y se contagia; unknown obliga a verificar.');
console.log('6. Con strict, undefined deja de ser una sorpresa de producción.');
