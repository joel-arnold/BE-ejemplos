import { describe, it, expect } from '@jest/globals';
import { aplicarDescuento, precioConIva, esPrecioValido } from './precios.js';

// ============================================================================
// NIVEL 1 — la anatomía de un test
// ============================================================================
// `describe` agrupa. `it` es un test. `expect` es la afirmación.
//
// Se lee en voz alta y tiene que sonar a español:
//   describe("aplicarDescuento") + it("devuelve el precio sin cambios si el
//   descuento es 0") = "aplicarDescuento devuelve el precio sin cambios si el
//   descuento es 0".
//
// Si el nombre del test no se puede leer así, casi siempre es porque el test
// está probando dos cosas a la vez.
// ============================================================================

describe('aplicarDescuento', () => {
  it('descuenta el porcentaje indicado', () => {
    // ARRANGE — preparar los datos
    const precio = 1000;
    const porcentaje = 20;

    // ACT — ejecutar UNA sola cosa, la que se está probando
    const resultado = aplicarDescuento(precio, porcentaje);

    // ASSERT — afirmar qué tendría que haber pasado
    expect(resultado).toBe(800);
  });

  // Las tres partes de arriba son el patrón AAA (Arrange-Act-Assert). No hace
  // falta escribir los comentarios: se nota igual en la forma del test. De acá
  // en adelante van sin rótulo.

  it('devuelve el precio sin cambios si el descuento es 0', () => {
    expect(aplicarDescuento(1000, 0)).toBe(1000);
  });

  it('deja el producto gratis si el descuento es 100', () => {
    expect(aplicarDescuento(1000, 100)).toBe(0);
  });

  // ==========================================================================
  // NIVEL 2 — los casos borde son los que encuentran bugs
  // ==========================================================================
  // Los tres tests de arriba son el "camino feliz" y casi nunca fallan. Los
  // bugs viven en los bordes: el 0, el límite, el negativo, el vacío.
  //
  // Regla práctica para elegir casos: para cada número, probar uno adentro,
  // los dos límites y uno afuera.
  // ==========================================================================

  it('rechaza un descuento negativo', () => {
    // Ojo con la forma: se le pasa a `expect` una FUNCIÓN, no el resultado.
    // Si escribieras expect(aplicarDescuento(1000, -5)).toThrow(), el error
    // explotaría antes de que expect exista y el test fallaría por otra razón.
    expect(() => aplicarDescuento(1000, -5)).toThrow(RangeError);
  });

  it('rechaza un descuento mayor a 100', () => {
    expect(() => aplicarDescuento(1000, 101)).toThrow('El descuento va de 0 a 100');
  });
});

// ============================================================================
// NIVEL 3 — el mismo test con muchos datos: it.each
// ============================================================================
// Cuando cambian los datos y no la lógica del test, repetir el `it` es ruido.
// `it.each` lo escribe una vez y lo corre con cada fila. Si falla la tercera,
// Jest dice exactamente cuál falló.
// ============================================================================

describe('precioConIva', () => {
  it.each([
    [1000, 1210],
    [100, 121],
    [0, 0],
    [1999.99, 2419.99], // el redondeo: sin él daría 2419.9879
  ])('a $%s le suma IVA y da $%s', (precio, esperado) => {
    expect(precioConIva(precio)).toBe(esperado);
  });
});

// ============================================================================
// NIVEL 4 — booleanos y el matcher correcto
// ============================================================================
// Todo se puede afirmar con `toBe(true)`, pero cuando falla el mensaje dice
// "esperaba true, recibí false" y no ayuda. Los matchers específicos dan
// mensajes de error mejores. Elegir el matcher es elegir qué vas a leer el día
// que el test se ponga rojo.
// ============================================================================

describe('esPrecioValido', () => {
  it('acepta un precio positivo', () => {
    expect(esPrecioValido(1000)).toBe(true);
  });

  it.each([0, -1, NaN, Infinity])('rechaza %p', (valor) => {
    expect(esPrecioValido(valor)).toBe(false);
  });
});
