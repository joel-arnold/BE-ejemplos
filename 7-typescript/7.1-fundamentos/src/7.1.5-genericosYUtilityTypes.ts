// ============================================================================
// GENÉRICOS Y UTILITY TYPES - Ejemplos progresivos
// ============================================================================
// Un genérico es un tipo que se completa cuando se usa: <T> es "el tipo que me
// digas". Ya venís usando uno sin saberlo: Promise<Producto>.
//
// Las líneas que darían error están COMENTADAS, con el mensaje del compilador.
// ============================================================================

console.clear();

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

const catalogo: Producto[] = [
  { id: 1, nombre: 'Teclado', precio: 25000 },
  { id: 2, nombre: 'Mouse', precio: 15000 },
  { id: 3, nombre: 'Monitor', precio: 180000 },
];

// ============================================================================
// NIVEL 1: El problema que resuelven los genéricos
// ============================================================================

console.log('=== NIVEL 1: Por qué un genérico ===\n');

// Sin genéricos hay dos malas opciones: repetir la función para cada tipo...
function primerNumero(arreglo: number[]): number | undefined {
  return arreglo[0];
}

// ...o usar any y perder todo el chequeo.
function primeroConAny(arreglo: any[]): any {
  return arreglo[0];
}

const n = primerNumero([1, 2, 3]); // number | undefined
const cualquiera = primeroConAny(catalogo); // any: se perdió el tipo

console.log(`primerNumero([1,2,3]) = ${n}`); // 1
console.log(`primeroConAny(...)    = ${cualquiera.nombre}`); // Teclado (sin chequeo)

console.log();

// ============================================================================
// NIVEL 2: Una función genérica
// ============================================================================

console.log('=== NIVEL 2: Función genérica ===\n');

// <T> es un parámetro de TIPO: se completa con lo que se pase al llamarla.
function primero<T>(arreglo: T[]): T | undefined {
  return arreglo[0];
}

const primerProducto = primero(catalogo); // Producto | undefined
const primerNombre = primero(['Teclado', 'Mouse']); // string | undefined

console.log(`primero(catalogo)?.nombre = ${primerProducto?.nombre}`); // Teclado
console.log(`primero(nombres)          = ${primerNombre}`); // Teclado

// El tipo entra y sale: no hace falta anotar nada al llamarla, y adentro del
// if el editor autocompleta las propiedades de Producto.
if (primerProducto) {
  console.log(`precio: $${primerProducto.precio}`);
}

console.log();

// ============================================================================
// NIVEL 3: Genéricos con restricciones (extends)
// ============================================================================

console.log('=== NIVEL 3: Restricciones ===\n');

// "T puede ser cualquier cosa, siempre que tenga un id numérico".
function buscarPorId<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

const encontrado = buscarPorId(catalogo, 2);
console.log(`buscarPorId(catalogo, 2) = ${encontrado?.nombre}`); // Mouse

// buscarPorId(['Teclado', 'Mouse'], 1);
// Error: Type 'string' is not assignable to type '{ id: number; }'.

console.log();

// ============================================================================
// NIVEL 4: Interfaces genéricas - el repository que sirve para todo
// ============================================================================

console.log('=== NIVEL 4: Interface genérica ===\n');

interface Repositorio<T extends { id: number }> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | undefined>;
}

class RepositorioEnMemoria<T extends { id: number }> implements Repositorio<T> {
  constructor(private items: T[]) {}

  async findAll(): Promise<T[]> {
    return this.items;
  }

  async findById(id: number): Promise<T | undefined> {
    return this.items.find((item) => item.id === id);
  }
}

const repoProductos = new RepositorioEnMemoria(catalogo);
const producto = await repoProductos.findById(3);

console.log(`findById(3) = ${producto?.nombre}`); // Monitor
console.log(`findAll().length = ${(await repoProductos.findAll()).length}`); // 3

console.log();

// ============================================================================
// NIVEL 5: Utility types - construir tipos a partir de otros
// ============================================================================

console.log('=== NIVEL 5: Omit, Pick y Partial ===\n');

// Omit: el mismo tipo, sin algunas propiedades. El alta llega sin id.
type ProductoNuevo = Omit<Producto, 'id'>;

// Pick: solo algunas propiedades. Útil para lo que se devuelve al cliente.
type ProductoResumen = Pick<Producto, 'id' | 'nombre'>;

// Partial: todas opcionales. Es exactamente un PATCH.
type ProductoParcial = Partial<Producto>;

const alta: ProductoNuevo = { nombre: 'Webcam', precio: 60000 };
const resumen: ProductoResumen = { id: 1, nombre: 'Teclado' };
const cambio: ProductoParcial = { precio: 22000 };

console.log(`alta:    ${JSON.stringify(alta)}`);
console.log(`resumen: ${JSON.stringify(resumen)}`);
console.log(`cambio:  ${JSON.stringify(cambio)}`);

// const altaMal: ProductoNuevo = { id: 4, nombre: 'Webcam', precio: 60000 };
// Error: Object literal may only specify known properties, and 'id' does not
//        exist in type 'ProductoNuevo'.

// La ventaja de DERIVAR en vez de duplicar: si mañana Producto suma un campo,
// los tres tipos se actualizan solos.

function actualizarProducto(id: number, cambios: ProductoParcial): Producto {
  const actual = catalogo.find((p) => p.id === id);
  if (!actual) {
    throw new Error(`No existe el producto ${id}`);
  }
  return { ...actual, ...cambios, id: actual.id }; // el id nunca se pisa
}

console.log(JSON.stringify(actualizarProducto(1, { precio: 22000 })));
// {"id":1,"nombre":"Teclado","precio":22000}

console.log();

// ============================================================================
// RESUMEN
// ============================================================================

console.log('=== RESUMEN ===\n');
console.log('1. <T> es un tipo que se completa al usar la función o la clase.');
console.log('2. Con genéricos el tipo entra y sale; con any se pierde.');
console.log('3. extends restringe qué tipos son aceptables (T extends { id: number }).');
console.log('4. Omit / Pick / Partial cubren el 90% de los casos de una API:');
console.log('   Omit para el alta, Pick para la respuesta, Partial para el PATCH.');
console.log('5. Derivar tipos evita que se desincronicen al cambiar el modelo.');
