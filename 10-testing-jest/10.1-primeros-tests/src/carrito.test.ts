import { describe, it, expect, beforeEach } from '@jest/globals';
import { calcularTotal, agregarItem, type Item } from './carrito.js';

// ============================================================================
// NIVEL 1 — toBe vs. toEqual: el error del primer día
// ============================================================================
// `toBe` compara con Object.is: para objetos y arrays pregunta si son EL MISMO
// objeto en memoria, no si tienen el mismo contenido. Dos objetos idénticos
// escritos en dos lugares distintos NO son el mismo objeto (unidad 4, paso por
// compartición).
//
// El mensaje de error cuando te equivocás es tan famoso como críptico:
//
//   Expected: {"nombre": "Mate", "precio": 5000}
//   Received: serializes to the same string
//
// "Se serializa igual" es Jest diciendo: el contenido es idéntico, pero me
// pediste identidad. Traducción: querías `toEqual`.
//
// Regla: números, strings y booleanos -> toBe. Objetos y arrays -> toEqual.
// ============================================================================

describe('agregarItem', () => {
  let carrito: Item[];

  // beforeEach corre antes de CADA `it` de este bloque. Sirve para que cada
  // test arranque de cero: si un test modifica `carrito`, el siguiente no se
  // entera. Tests que dependen del orden en que corren son tests que un día
  // fallan solos y nadie sabe por qué.
  beforeEach(() => {
    carrito = [{ nombre: 'Mate', precio: 5000, cantidad: 1 }];
  });

  it('agrega un producto que no estaba', () => {
    const resultado = agregarItem(carrito, { nombre: 'Bombilla', precio: 2000, cantidad: 1 });

    expect(resultado).toEqual([
      { nombre: 'Mate', precio: 5000, cantidad: 1 },
      { nombre: 'Bombilla', precio: 2000, cantidad: 1 },
    ]);
  });

  it('suma la cantidad si el producto ya estaba', () => {
    const resultado = agregarItem(carrito, { nombre: 'Mate', precio: 5000, cantidad: 2 });

    expect(resultado).toHaveLength(1);
    expect(resultado[0].cantidad).toBe(3);
  });

  // ==========================================================================
  // NIVEL 2 — testear lo que la función promete NO hacer
  // ==========================================================================
  // `agregarItem` promete devolver un carrito nuevo sin tocar el original. Eso
  // es parte del contrato y por lo tanto se testea. Es el test que se olvida
  // siempre, y el que atrapa al que "optimiza" la función con un `push`.
  // ==========================================================================

  it('no modifica el carrito original', () => {
    agregarItem(carrito, { nombre: 'Bombilla', precio: 2000, cantidad: 1 });

    expect(carrito).toHaveLength(1);
  });
});

// ============================================================================
// NIVEL 3 — el array vacío
// ============================================================================
// Toda función que recibe una lista tiene que contestar qué hace con la lista
// vacía. Casi siempre la respuesta es obvia y casi siempre nadie la escribió.
// ============================================================================

describe('calcularTotal', () => {
  it('devuelve 0 con el carrito vacío', () => {
    expect(calcularTotal([])).toBe(0);
  });

  it('multiplica precio por cantidad y suma todo', () => {
    const items: Item[] = [
      { nombre: 'Mate', precio: 5000, cantidad: 2 },
      { nombre: 'Bombilla', precio: 2000, cantidad: 3 },
    ];

    expect(calcularTotal(items)).toBe(16000);
  });
});
