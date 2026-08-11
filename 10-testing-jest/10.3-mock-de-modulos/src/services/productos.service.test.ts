import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import type * as RepoModule from '../repositories/productos.repository.js';
import type { PayloadToken, Producto } from '../domain/producto.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../shared/errors.js';

// ============================================================================
// INTERCEPTAR EL IMPORT — el orden de este archivo NO es negociable
// ============================================================================
// El service hace `import * as repo from '.../productos.repository.js'` y no
// se puede cambiar. Entonces se le cambia el módulo por debajo: cuando el
// service pida ese archivo, Jest le entrega otra cosa.
//
// Son tres pasos y van en este orden exacto:
//   1. Armar el módulo falso.
//   2. Registrarlo con jest.unstable_mockModule().
//   3. RECIÉN AHÍ importar el service, con `await import()`.
//
// El paso 3 es el que sorprende. En CommonJS, `jest.mock()` se "hoistea": Jest
// mueve la llamada arriba de todos los `import` al compilar, y por eso podés
// escribirla después y funciona igual.
//
// En ESM eso es imposible: los `import` se resuelven ANTES de que corra la
// primera línea del archivo. Si el service estuviera importado arriba con un
// `import` normal, ya se habría cargado con el repository de verdad y el mock
// llegaría tarde. Por eso la importación tiene que ser dinámica y explícita.
//
// Y `await` en el cuerpo del archivo (top-level await) funciona porque esto es
// un módulo ESM — la misma razón por la que venimos escribiendo `.js` en los
// imports desde la unidad 7.
// ============================================================================

// 1. El módulo falso: un objeto con las mismas claves que exporta el original.
const repo = {
  findAll: jest.fn<typeof RepoModule.findAll>(),
  findByNombre: jest.fn<typeof RepoModule.findByNombre>(),
  findById: jest.fn<typeof RepoModule.findById>(),
  guardar: jest.fn<typeof RepoModule.guardar>(),
  eliminar: jest.fn<typeof RepoModule.eliminar>(),
};

// 2. La ruta se escribe RELATIVA A ESTE ARCHIVO, no al service, y tiene que
//    resolver al mismo módulo que el service importa. Si apunta a un archivo
//    que no existe, la suite entera no arranca ("Test suite failed to run"),
//    que al menos es un error ruidoso y fácil de ver.
jest.unstable_mockModule('../repositories/productos.repository.js', () => repo);

// 3. Ahora sí. Nunca con `import ... from` arriba del archivo.
const { crearProducto, eliminarProducto } = await import('./productos.service.js');

const mate: Producto = { id: 1, nombre: 'Mate', precio: 5000, creadoPorId: 7 };

const juan: PayloadToken = { sub: '7', email: 'juan@utn.edu.ar', rol: 'usuario' };
const ana: PayloadToken = { sub: '9', email: 'ana@utn.edu.ar', rol: 'usuario' };
const admin: PayloadToken = { sub: '1', email: 'admin@utn.edu.ar', rol: 'admin' };

beforeEach(() => {
  jest.clearAllMocks();
});

// ============================================================================
// LOS TESTS SON IDÉNTICOS A LOS DEL 10.2
// ============================================================================
// Y eso es lo importante de este ejemplo: cambió CÓMO se pone el repository
// falso, no qué se prueba. La dificultad de arriba es puro andamiaje.
// ============================================================================

describe('crearProducto', () => {
  it('guarda el producto cuando el nombre está libre', async () => {
    repo.findByNombre.mockResolvedValue(null);
    repo.guardar.mockResolvedValue(mate);

    const creado = await crearProducto({ nombre: 'Mate', precio: 5000 }, juan);

    expect(creado).toEqual(mate);
  });

  it('usa como dueño el id del token, no lo que venga en los datos', async () => {
    repo.findByNombre.mockResolvedValue(null);
    repo.guardar.mockResolvedValue(mate);

    await crearProducto({ nombre: 'Mate', precio: 5000 }, juan);

    expect(repo.guardar).toHaveBeenCalledWith({ nombre: 'Mate', precio: 5000 }, 7);
  });

  it('rechaza un nombre repetido y no guarda nada', async () => {
    repo.findByNombre.mockResolvedValue(mate);

    await expect(crearProducto({ nombre: 'Mate', precio: 9000 }, juan)).rejects.toThrow(
      ValidationError,
    );
    expect(repo.guardar).not.toHaveBeenCalled();
  });
});

describe('eliminarProducto', () => {
  it('deja borrar al dueño', async () => {
    repo.findById.mockResolvedValue(mate);

    await eliminarProducto(1, juan);

    expect(repo.eliminar).toHaveBeenCalledWith(mate);
  });

  it('deja borrar a un admin aunque no sea el dueño', async () => {
    repo.findById.mockResolvedValue(mate);

    await eliminarProducto(1, admin);

    expect(repo.eliminar).toHaveBeenCalledWith(mate);
  });

  it('no deja borrar el producto de otro', async () => {
    repo.findById.mockResolvedValue(mate);

    await expect(eliminarProducto(1, ana)).rejects.toThrow(ForbiddenError);
    expect(repo.eliminar).not.toHaveBeenCalled();
  });

  it('avisa que no existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(eliminarProducto(999, juan)).rejects.toThrow(NotFoundError);
  });
});
