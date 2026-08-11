import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { crearApp } from './app.js';
import { emitirToken } from './shared/jwt.js';
import { ForbiddenError, NotFoundError, ValidationError } from './shared/errors.js';
import type { ProductosService } from './services/productos.service.js';
import type { Producto } from './domain/producto.js';

// ============================================================================
// TESTS DE INTEGRACIÓN — la API entera, sin base y sin puerto ocupado
// ============================================================================
// El 10.2 probó el service aislado. Quedaron cosas afuera que ningún test de
// service puede ver:
//
//   - ¿La ruta está registrada en /api/productos o en /api/producto?
//   - ¿El POST pide token? ¿El GET lo pide sin querer?
//   - ¿El ForbiddenError sale como 403 o como 500?
//   - ¿El body llega parseado? (¿alguien se olvidó express.json()?)
//   - ¿El DELETE contesta 204 y sin cuerpo?
//
// Todo eso vive en el cableado, no en la lógica. Y el cableado se rompe seguido.
//
// supertest hace el request de verdad contra la app de Express, pero sin
// levantar un puerto fijo: la arranca en uno libre, hace el request y la cierra.
// Por eso no hace falta `npm run dev` en otra terminal ni nada corriendo.
// ============================================================================

// El service falso, igual que en el 10.2 pero un piso más arriba. Acá no
// interesa la lógica del service (esa ya está probada): interesa qué hace la
// API con lo que el service devuelve o lanza.
const service = {
  listar: jest.fn<ProductosService['listar']>(),
  crear: jest.fn<ProductosService['crear']>(),
  eliminar: jest.fn<ProductosService['eliminar']>(),
};

const app = crearApp(service);

const mate: Producto = { id: 1, nombre: 'Mate', precio: 5000, creadoPorId: 7 };

// Un token de verdad, firmado con el mismo secret que usa la API. El middleware
// de autenticación se ejecuta completo: no está mockeado. Así el test también
// cubre "¿esta ruta pide token?".
const tokenDeJuan = emitirToken({ sub: '7', email: 'juan@utn.edu.ar', rol: 'usuario' });

beforeEach(() => {
  jest.clearAllMocks();
});

// ============================================================================
// NIVEL 1 — la ruta pública
// ============================================================================

describe('GET /api/productos', () => {
  it('devuelve 200 y la lista', async () => {
    service.listar.mockResolvedValue([mate]);

    const res = await request(app).get('/api/productos');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([mate]);
  });

  it('no pide token', async () => {
    service.listar.mockResolvedValue([]);

    const res = await request(app).get('/api/productos');

    expect(res.status).toBe(200);
  });
});

// ============================================================================
// NIVEL 2 — la ruta protegida: el test que el service no puede hacer
// ============================================================================

describe('POST /api/productos', () => {
  it('devuelve 401 sin token', async () => {
    const res = await request(app).post('/api/productos').send({ nombre: 'Mate', precio: 5000 });

    expect(res.status).toBe(401);
    // Y el service ni se enteró: el middleware cortó antes.
    expect(service.crear).not.toHaveBeenCalled();
  });

  it('devuelve 401 con un token firmado con otro secret', async () => {
    // Un token con la forma correcta pero firma inválida. Es el ataque, no el
    // olvido: por eso se verifica la firma y no solo que el header exista.
    const falso = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5OTkiLCJyb2wiOiJhZG1pbiJ9.firmaTruchaX';

    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', falso)
      .send({ nombre: 'Mate', precio: 5000 });

    expect(res.status).toBe(401);
  });

  it('devuelve 201 y el producto creado con un token válido', async () => {
    service.crear.mockResolvedValue(mate);

    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${tokenDeJuan}`)
      .send({ nombre: 'Mate', precio: 5000 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mate);
  });

  it('le pasa al service el usuario que salió del token', async () => {
    service.crear.mockResolvedValue(mate);

    await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${tokenDeJuan}`)
      .send({ nombre: 'Mate', precio: 5000 });

    expect(service.crear).toHaveBeenCalledWith(
      { nombre: 'Mate', precio: 5000 },
      expect.objectContaining({ sub: '7', rol: 'usuario' }),
    );
  });
});

// ============================================================================
// NIVEL 3 — la traducción de errores de dominio a códigos HTTP
// ============================================================================
// Esta es la tabla del errorHandler, y es la razón principal para escribir
// tests de integración. El test de service verifica que se lance
// ForbiddenError; que eso llegue al cliente como 403 y no como 500 solo se
// puede ver desde acá.
//
// Un errorHandler al que se le olvidó una rama devuelve 500 y la suite de
// services sigue toda verde.
// ============================================================================

describe('los errores del service se traducen a códigos HTTP', () => {
  it('ValidationError -> 400', async () => {
    service.crear.mockRejectedValue(new ValidationError('Ya existe un producto llamado "Mate"'));

    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${tokenDeJuan}`)
      .send({ nombre: 'Mate', precio: 5000 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Ya existe un producto llamado "Mate"' });
  });

  it('ForbiddenError -> 403', async () => {
    service.eliminar.mockRejectedValue(new ForbiddenError('Solo podés borrar los que creaste'));

    const res = await request(app)
      .delete('/api/productos/1')
      .set('Authorization', `Bearer ${tokenDeJuan}`);

    expect(res.status).toBe(403);
  });

  it('NotFoundError -> 404', async () => {
    service.eliminar.mockRejectedValue(new NotFoundError('No existe el producto 999'));

    const res = await request(app)
      .delete('/api/productos/999')
      .set('Authorization', `Bearer ${tokenDeJuan}`);

    expect(res.status).toBe(404);
  });
});

// ============================================================================
// NIVEL 4 — los detalles del protocolo
// ============================================================================

describe('DELETE /api/productos/:id', () => {
  it('devuelve 204 sin cuerpo', async () => {
    service.eliminar.mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/productos/1')
      .set('Authorization', `Bearer ${tokenDeJuan}`);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it('convierte el id de la URL a número antes de pasarlo al service', async () => {
    service.eliminar.mockResolvedValue(undefined);

    await request(app).delete('/api/productos/42').set('Authorization', `Bearer ${tokenDeJuan}`);

    // Los params de Express son SIEMPRE strings. Si el controller se olvida el
    // Number(), el service recibe '42' y la comparación de dueño falla de una
    // forma rarísima. Este test lo fija.
    expect(service.eliminar).toHaveBeenCalledWith(42, expect.anything());
  });
});
