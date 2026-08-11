import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { crearProductosService } from './productos.service.js';
import type { ProductosRepository } from '../repositories/productos.repository.js';
import type { PayloadToken, Producto } from '../domain/producto.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../shared/errors.js';

// ============================================================================
// EL REPOSITORY FALSO
// ============================================================================
// Cinco funciones vacías que Jest sabe vigilar. Eso es todo el "mock".
//
// `jest.fn()` devuelve una función que no hace nada, pero que ANOTA: con qué
// argumentos la llamaron, cuántas veces, qué devolvió. Y se le puede decir qué
// contestar (`mockResolvedValue`).
//
// El `<ProductosRepository['findAll']>` no es adorno: hace que TypeScript
// chequee que lo que le mandás contestar tenga la forma correcta. Si mañana el
// repository devuelve otra cosa, este archivo deja de compilar y te enterás
// antes de correr nada. Es la unidad 7 trabajando para la 10.
// ============================================================================

const repo = {
  findAll: jest.fn<ProductosRepository['findAll']>(),
  findByNombre: jest.fn<ProductosRepository['findByNombre']>(),
  findById: jest.fn<ProductosRepository['findById']>(),
  guardar: jest.fn<ProductosRepository['guardar']>(),
  eliminar: jest.fn<ProductosRepository['eliminar']>(),
};

const service = crearProductosService(repo);

// Datos que se repiten. Que estén afuera y con nombre hace que cada test diga
// lo que prueba y no cómo se arman los datos.
const mate: Producto = { id: 1, nombre: 'Mate', precio: 5000, creadoPorId: 7 };

const juan: PayloadToken = { sub: '7', email: 'juan@utn.edu.ar', rol: 'usuario' };
const ana: PayloadToken = { sub: '9', email: 'ana@utn.edu.ar', rol: 'usuario' };
const admin: PayloadToken = { sub: '1', email: 'admin@utn.edu.ar', rol: 'admin' };

// Sin esto, un test ve las llamadas del test anterior y `toHaveBeenCalledTimes`
// empieza a contar de más. Es el olvido que produce el bug más desconcertante
// de todos: la suite pasa entera, pero un test solo falla (o al revés).
beforeEach(() => {
  jest.clearAllMocks();
});

// ============================================================================
// NIVEL 1 — el camino feliz
// ============================================================================

describe('crear', () => {
  it('guarda el producto cuando el nombre está libre', async () => {
    repo.findByNombre.mockResolvedValue(null); // no hay ninguno con ese nombre
    repo.guardar.mockResolvedValue(mate);

    const creado = await service.crear({ nombre: 'Mate', precio: 5000 }, juan);

    expect(creado).toEqual(mate);
  });

  // ==========================================================================
  // NIVEL 2 — verificar la conversación con el repository
  // ==========================================================================
  // Hasta acá miramos lo que el service DEVUELVE. Pero parte de lo que hace un
  // service es hablar con el repository, y eso también es su contrato.
  //
  // Este test es el que atrapa el bug de seguridad de la unidad 9: si alguien
  // "arregla" el service para tomar el dueño del body en vez del token,
  // `crear` sigue devolviendo un producto y el test de arriba sigue verde.
  // Este se pone rojo.
  // ==========================================================================

  it('usa como dueño el id del token, no lo que venga en los datos', async () => {
    repo.findByNombre.mockResolvedValue(null);
    repo.guardar.mockResolvedValue(mate);

    await service.crear({ nombre: 'Mate', precio: 5000 }, juan);

    expect(repo.guardar).toHaveBeenCalledWith({ nombre: 'Mate', precio: 5000 }, 7);
  });

  it('rechaza un nombre repetido', async () => {
    repo.findByNombre.mockResolvedValue(mate);

    // Para una promesa que tiene que fallar: `rejects` + await. Sin el await,
    // el test termina antes de que la promesa se resuelva y pasa siempre.
    await expect(service.crear({ nombre: 'Mate', precio: 9000 }, juan)).rejects.toThrow(
      ValidationError,
    );
  });

  // Un error tirado a tiempo también significa NO hacer lo que seguía. Este
  // test dice "y además no lo guardó", que es la mitad importante.
  it('no guarda nada si el nombre estaba repetido', async () => {
    repo.findByNombre.mockResolvedValue(mate);

    await expect(service.crear({ nombre: 'Mate', precio: 9000 }, juan)).rejects.toThrow();

    expect(repo.guardar).not.toHaveBeenCalled();
  });
});

// ============================================================================
// NIVEL 3 — las reglas de autorización, sin base y sin servidor
// ============================================================================
// Estos cinco tests son la unidad entera en una pantalla. Cada uno tarda
// milisegundos y no necesita MySQL, ni un token de verdad, ni levantar Express.
//
// Leídos de corrido, son la documentación de la regla — y una documentación
// que no puede quedar desactualizada, porque si miente, se pone roja.
// ============================================================================

describe('eliminar', () => {
  it('deja borrar al dueño', async () => {
    repo.findById.mockResolvedValue(mate); // mate.creadoPorId === 7, y juan es el 7

    await service.eliminar(1, juan);

    expect(repo.eliminar).toHaveBeenCalledWith(mate);
  });

  it('deja borrar a un admin aunque no sea el dueño', async () => {
    repo.findById.mockResolvedValue(mate);

    await service.eliminar(1, admin);

    expect(repo.eliminar).toHaveBeenCalledWith(mate);
  });

  it('no deja borrar el producto de otro', async () => {
    repo.findById.mockResolvedValue(mate); // es de juan (7), lo pide ana (9)

    await expect(service.eliminar(1, ana)).rejects.toThrow(ForbiddenError);
    expect(repo.eliminar).not.toHaveBeenCalled();
  });

  it('avisa que no existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.eliminar(999, juan)).rejects.toThrow(NotFoundError);
  });

  // ==========================================================================
  // NIVEL 4 — testear el ORDEN, que también es una decisión
  // ==========================================================================
  // Un producto que no existe, pedido por alguien que tampoco sería el dueño.
  // ¿404 o 403? Las dos respuestas son defendibles y el service eligió una:
  // primero existencia, después permisos.
  //
  // Sin este test, mañana alguien reordena los ifs "para que quede más prolijo"
  // y cambia una decisión de producto sin darse cuenta. Con este test, se
  // entera enseguida.
  // ==========================================================================

  it('contesta 404 y no 403 cuando el producto no existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.eliminar(999, ana)).rejects.toThrow(NotFoundError);
  });
});
