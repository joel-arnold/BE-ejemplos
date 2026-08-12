import { describe, it, expect } from '@jest/globals';
import { aplicarDescuento, precioConIva } from './precios.js';

// Estos tests son el portero del deploy. Si alguno se pone rojo, el workflow
// falla y la versión no se publica.
//
// Probalo: cambiá el 800 por 900, commiteá y mirá GitHub.

describe('aplicarDescuento', () => {
  it('descuenta el porcentaje indicado', () => {
    expect(aplicarDescuento(1000, 20)).toBe(800);
  });

  it('con 0% devuelve el precio original', () => {
    expect(aplicarDescuento(1000, 0)).toBe(1000);
  });

  it('con 100% devuelve 0', () => {
    expect(aplicarDescuento(1000, 100)).toBe(0);
  });

  it('rechaza un porcentaje negativo', () => {
    expect(() => aplicarDescuento(1000, -5)).toThrow(RangeError);
  });

  it('rechaza un porcentaje mayor a 100', () => {
    expect(() => aplicarDescuento(1000, 101)).toThrow(RangeError);
  });
});

describe('precioConIva', () => {
  it.each([
    [1000, 1210],
    [100, 121],
    [0, 0],
    [1999.99, 2419.99],
  ])('a $%s le suma IVA y da $%s', (precio, esperado) => {
    expect(precioConIva(precio)).toBe(esperado);
  });
});
