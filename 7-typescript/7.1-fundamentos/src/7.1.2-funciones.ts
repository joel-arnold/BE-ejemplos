// ============================================================================
// FUNCIONES TIPADAS - Ejemplos progresivos
// ============================================================================
// En una función se tipan dos cosas: los parámetros y lo que devuelve.
// Los ejemplos 2.7 y 2.8 de la unidad de funciones, ahora con tipos.
//
// Las líneas que darían error están COMENTADAS, con el mensaje del compilador.
// ============================================================================

console.clear();

// ============================================================================
// NIVEL 1: Parámetros y valor de retorno
// ============================================================================

console.log('=== NIVEL 1: Parámetros y retorno ===\n');

function conIva(precio: number): number {
  return precio * 1.21;
}

console.log(`conIva(1000) = ${conIva(1000)}`); // 1210.0000000000002

// conIva('1000');
// Error: Argument of type 'string' is not assignable to parameter of type 'number'.

// El tipo de retorno se puede omitir (TS lo infiere), pero en las funciones
// exportadas conviene escribirlo: es documentación, y si el cuerpo devuelve
// otra cosa por accidente, el error aparece acá y no tres archivos más allá.

console.log();

// ============================================================================
// NIVEL 2: Opcionales, valores por defecto y void
// ============================================================================

console.log('=== NIVEL 2: Opcionales, defaults y void ===\n');

// El ? marca un parámetro opcional: su tipo pasa a ser 'string | undefined'.
function etiquetar(nombre: string, categoria?: string): string {
  return categoria ? `[${categoria}] ${nombre}` : nombre;
}

// Valor por defecto: no hace falta anotar el tipo, se infiere del valor.
function formatearPrecio(precio: number, moneda = '$'): string {
  return `${moneda}${precio.toFixed(2)}`;
}

// void = no devuelve nada útil.
function logProducto(nombre: string): void {
  console.log(`[producto] ${nombre}`);
}

console.log(etiquetar('Teclado')); // Teclado
console.log(etiquetar('Teclado', 'Periféricos')); // [Periféricos] Teclado
console.log(formatearPrecio(25000)); // $25000.00
console.log(formatearPrecio(25000, 'USD ')); // USD 25000.00
logProducto('Mouse'); // [producto] Mouse

console.log();

// ============================================================================
// NIVEL 3: Arrow functions
// ============================================================================

console.log('=== NIVEL 3: Arrow functions ===\n');

const duplicar = (n: number): number => n * 2;
const triplicar = (n: number): number => n * 3;
const alCuadrado = (n: number): number => n * n;

console.log(`duplicar(5)   = ${duplicar(5)}`); // 10
console.log(`triplicar(5)  = ${triplicar(5)}`); // 15
console.log(`alCuadrado(5) = ${alCuadrado(5)}`); // 25

console.log();

// ============================================================================
// NIVEL 4: Tipar una función que RECIBE una función (el 2.7, tipado)
// ============================================================================

console.log('=== NIVEL 4: Función de orden superior (parámetro) ===\n');

// El tipo de una función se escribe con la misma flecha que la arrow function:
// (n: number) => number se lee "recibe un number y devuelve un number".
function procesarArreglo(arreglo: number[], operacion: (n: number) => number): number[] {
  return arreglo.map(operacion);
}

const numeros = [1, 2, 3, 4, 5];

console.log(`original:    [${numeros}]`);
console.log(`duplicados:  [${procesarArreglo(numeros, duplicar)}]`); // [2,4,6,8,10]
console.log(`al cuadrado: [${procesarArreglo(numeros, (n) => n * n)}]`); // [1,4,9,16,25]

// procesarArreglo(numeros, (n) => 'valor: ' + n);
// Error: Type 'string' is not assignable to type 'number'.

// Detalle: en (n) => n * n no hace falta anotar 'n'. TypeScript ya sabe qué
// firma tiene que cumplir ese callback porque lo declara el parámetro. Se
// llama INFERENCIA CONTEXTUAL, y por eso se escriben muchos menos tipos de los
// que uno imagina.

console.log();

// ============================================================================
// NIVEL 5: Tipar una función que DEVUELVE una función (el 2.8, tipado)
// ============================================================================

console.log('=== NIVEL 5: Función de orden superior (retorno) ===\n');

function crearMultiplicador(factor: number): (n: number) => number {
  return (numero) => numero * factor; // closure: 'factor' queda capturado
}

const por2 = crearMultiplicador(2);
const por5 = crearMultiplicador(5);

console.log(`por2(7) = ${por2(7)}`); // 14
console.log(`por5(7) = ${por5(7)}`); // 35

console.log();

// ============================================================================
// NIVEL 6: async siempre devuelve Promise<T>
// ============================================================================

console.log('=== NIVEL 6: async y Promise<T> ===\n');

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

// Una función async nunca devuelve el valor: devuelve una PROMESA del valor.
// El tipo lo dice explícitamente.
async function buscarProductos(): Promise<Producto[]> {
  return [
    { id: 1, nombre: 'Teclado', precio: 25000 },
    { id: 2, nombre: 'Mouse', precio: 15000 },
  ];
}

// const sinAwait = buscarProductos();
// sinAwait.map((p) => p.nombre);
// Error: Property 'map' does not exist on type 'Promise<Producto[]>'.
//
// El await olvidado es EL bug clásico de la unidad de asincronía. En JavaScript
// aparece como un undefined raro dos funciones más adelante; acá es un error de
// compilación en la línea exacta.

const productos = await buscarProductos(); // Producto[]
console.log(`productos: ${productos.map((p) => p.nombre).join(', ')}`);

console.log();

// ============================================================================
// RESUMEN
// ============================================================================

console.log('=== RESUMEN ===\n');
console.log('1. Se tipan los parámetros y el retorno; el retorno se escribe si se exporta.');
console.log('2. `?` hace opcional un parámetro; un valor por defecto infiere el tipo.');
console.log('3. El tipo de una función es su firma: (n: number) => number.');
console.log('4. Los callbacks no necesitan anotación: la inferencia es contextual.');
console.log('5. async siempre devuelve Promise<T>; olvidarse el await no compila.');
