import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from './app.js';

// Tests de integración con supertest, como en el 10.4. En el workflow son los
// que más valen: verifican la API entera, sin base y sin puerto, en un segundo.

describe('GET /health', () => {
  it('contesta 200 — es lo que mira la plataforma de hosting', async () => {
    const respuesta = await request(app).get('/health');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ estado: 'ok' });
  });
});

describe('GET /api/precios/:precio', () => {
  it('calcula IVA y descuento', async () => {
    const respuesta = await request(app).get('/api/precios/1000');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      precio: 1000,
      conIva: 1210,
      conDescuento10: 900,
    });
  });

  it('rechaza lo que no es un número', async () => {
    const respuesta = await request(app).get('/api/precios/mate');

    expect(respuesta.status).toBe(400);
  });
});
