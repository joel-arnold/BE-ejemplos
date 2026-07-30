// ============================================================================
// OBJETOS: INTERFACE Y TYPE - Ejemplos progresivos
// ============================================================================
// Repetir { nombre: string; precio: number } en cada firma no escala. Para eso
// están las dos formas de ponerle nombre a una forma de objeto.
//
// Las líneas que darían error están COMENTADAS, con el mensaje del compilador.
// ============================================================================

console.clear();

// ============================================================================
// NIVEL 1: interface y type - dos formas de nombrar una forma
// ============================================================================

console.log('=== NIVEL 1: interface y type ===\n');

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

type ProductoAlternativo = {
  id: number;
  nombre: string;
  precio: number;
};

// Para describir objetos hacen prácticamente lo mismo. La recomendación para la
// materia: interface para entidades y formas de objetos, type para uniones,
// alias y tipos derivados. Lo importante es ser consistente en todo el proyecto.

const teclado: Producto = { id: 1, nombre: 'Teclado', precio: 25000 };
const mouse: ProductoAlternativo = { id: 2, nombre: 'Mouse', precio: 15000 };

console.log(`${teclado.nombre}: $${teclado.precio}`);
console.log(`${mouse.nombre}: $${mouse.precio}`);

// const roto: Producto = { id: 3, nombre: 'Monitor' };
// Error: Property 'precio' is missing in type '{ id: number; nombre: string; }'
//        but required in type 'Producto'.

console.log();

// ============================================================================
// NIVEL 2: Propiedades opcionales y readonly
// ============================================================================

console.log('=== NIVEL 2: Opcionales y readonly ===\n');

interface ProductoCompleto {
  readonly id: number; // no se puede reasignar después de creado
  nombre: string;
  precio: number;
  descripcion?: string; // opcional: string | undefined
}

const monitor: ProductoCompleto = { id: 3, nombre: 'Monitor', precio: 180000 };

// monitor.id = 99;
// Error: Cannot assign to 'id' because it is a read-only property.

// console.log(monitor.descripcion.toUpperCase());
// Error: 'monitor.descripcion' is possibly 'undefined'.

console.log(`descripción: ${monitor.descripcion ?? '(sin descripción)'}`);

monitor.precio = 175000; // esto sí: 'precio' no es readonly
console.log(`${monitor.nombre}: $${monitor.precio}`);

console.log();

// ============================================================================
// NIVEL 3: Objetos anidados y arrays de objetos
// ============================================================================

console.log('=== NIVEL 3: Anidados y arrays ===\n');

interface Categoria {
  id: number;
  nombre: string;
}

interface ProductoConCategoria extends Producto {
  categoria: Categoria; // una interface puede extender otra
}

const catalogo: ProductoConCategoria[] = [
  { id: 1, nombre: 'Teclado', precio: 25000, categoria: { id: 1, nombre: 'Periféricos' } },
  { id: 2, nombre: 'Monitor', precio: 180000, categoria: { id: 2, nombre: 'Pantallas' } },
];

catalogo.forEach((p) => {
  console.log(`${p.nombre} (${p.categoria.nombre}): $${p.precio}`);
});

// El autocompletado del editor recorre toda la estructura: p.categoria.nombre
// se completa solo, y p.categoria.nombrre no compila.

console.log();

// ============================================================================
// NIVEL 4: Uniones discriminadas - el patrón del resultado
// ============================================================================

console.log('=== NIVEL 4: Uniones discriminadas ===\n');

// Dos formas posibles, con una propiedad en común que dice cuál es: TypeScript
// usa esa propiedad para saber qué hay adentro de cada rama.
type Resultado =
  | { ok: true; producto: Producto }
  | { ok: false; error: string };

function buscarProducto(id: number): Resultado {
  const encontrado = catalogo.find((p) => p.id === id);
  if (!encontrado) {
    return { ok: false, error: `No existe el producto ${id}` };
  }
  return { ok: true, producto: encontrado };
}

const r1 = buscarProducto(1);
if (r1.ok) {
  console.log(`encontrado: ${r1.producto.nombre}`); // acá existe 'producto'
} else {
  console.log(`error: ${r1.error}`); // y acá existe 'error'
}

const r2 = buscarProducto(99);
console.log(r2.ok ? `encontrado: ${r2.producto.nombre}` : `error: ${r2.error}`);

// Este es exactamente el patrón que devuelve safeParse() de Zod (ejemplo 7.3).

console.log();

// ============================================================================
// NIVEL 5: Interfaces como contrato entre capas
// ============================================================================

console.log('=== NIVEL 5: La interface como contrato ===\n');

type ProductoNuevo = Omit<Producto, 'id'>; // el alta llega sin id

// Esto es, con sintaxis, el "puerto" de la arquitectura hexagonal: el dominio
// declara qué necesita y la infraestructura lo implementa.
interface RepositorioProductos {
  findAll(): Promise<Producto[]>;
  guardar(datos: ProductoNuevo): Promise<Producto>;
}

const productosGuardados: Producto[] = [];

const repoEnMemoria: RepositorioProductos = {
  // Ni 'datos' ni los retornos necesitan anotación: la interface ya los declaró.
  async findAll() {
    return productosGuardados;
  },

  async guardar(datos) {
    const nuevo: Producto = { id: productosGuardados.length + 1, ...datos };
    productosGuardados.push(nuevo);
    return nuevo;
  },
};

const guardado = await repoEnMemoria.guardar({ nombre: 'Auriculares', precio: 45000 });
console.log(`guardado: #${guardado.id} ${guardado.nombre}`);
console.log(`total en el repo: ${(await repoEnMemoria.findAll()).length}`);

console.log();

// ============================================================================
// RESUMEN
// ============================================================================

console.log('=== RESUMEN ===\n');
console.log('1. interface para entidades; type para uniones y derivados.');
console.log('2. `?` marca opcional, `readonly` impide reasignar.');
console.log('3. Una interface puede extender otra (extends).');
console.log('4. Las uniones discriminadas dan narrowing por una propiedad común.');
console.log('5. Una interface es un contrato verificable entre capas.');
