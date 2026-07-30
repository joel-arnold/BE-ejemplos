// ============================================================================
// CLASES EN TYPESCRIPT - Ejemplos progresivos
// ============================================================================
// Las clases de la unidad 5 siguen siendo las mismas, con dos agregados:
// modificadores de acceso y la posibilidad de declarar que una clase CUMPLE
// una interface (implements).
//
// Este archivo es la base directa de la próxima unidad: las entidades de
// MikroORM son clases TypeScript con propiedades tipadas más decoradores.
//
// Las líneas que darían error están COMENTADAS, con el mensaje del compilador.
// ============================================================================

console.clear();

// ============================================================================
// NIVEL 1: Propiedades tipadas y modificadores de acceso
// ============================================================================

console.log('=== NIVEL 1: Propiedades y modificadores ===\n');

class ProductoBasico {
  // En TypeScript las propiedades se DECLARAN antes de usarlas.
  public nombre: string;
  private precio: number;
  readonly id: number;

  constructor(id: number, nombre: string, precio: number) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
  }

  precioConIva(): number {
    return this.precio * 1.21;
  }
}

const teclado = new ProductoBasico(1, 'Teclado', 25000);

console.log(`${teclado.nombre}: $${teclado.precioConIva().toFixed(2)}`); // 30250.00

// console.log(teclado.precio);
// Error: Property 'precio' is private and only accessible within class 'ProductoBasico'.

// teclado.id = 99;
// Error: Cannot assign to 'id' because it is a read-only property.

console.log();

// ============================================================================
// NIVEL 2: Parameter properties - declarar y asignar de una vez
// ============================================================================

console.log('=== NIVEL 2: Parameter properties ===\n');

// Poner un modificador en un parámetro del constructor declara la propiedad Y
// la asigna. Es la misma clase de arriba, sin las seis líneas repetidas.
class Producto {
  private descuento = 0;

  constructor(
    public readonly id: number,
    public nombre: string,
    public precio: number
  ) {}

  aplicarDescuento(porcentaje: number): void {
    if (porcentaje < 0 || porcentaje > 0.5) {
      throw new Error('El descuento debe estar entre 0 y 50%');
    }
    this.descuento = porcentaje;
  }

  precioFinal(): number {
    return this.precio * (1 - this.descuento);
  }
}

const mouse = new Producto(2, 'Mouse', 15000);
console.log(`precio de lista: $${mouse.precioFinal()}`); // 15000

mouse.aplicarDescuento(0.2);
console.log(`con 20% off:     $${mouse.precioFinal()}`); // 12000

// mouse.descuento = 0.9;
// Error: Property 'descuento' is private and only accessible within class 'Producto'.

console.log();

// ============================================================================
// NIVEL 3: private de TypeScript vs #privado de JavaScript
// ============================================================================

console.log('=== NIVEL 3: private vs # ===\n');

class Usuario {
  #passwordHash: string; // privado DE VERDAD, en ejecución (JavaScript)
  private email: string; // privado solo para el compilador (TypeScript)

  constructor(email: string, passwordHash: string) {
    this.email = email;
    this.#passwordHash = passwordHash;
  }

  verificar(hash: string): boolean {
    return this.#passwordHash === hash;
  }

  toString(): string {
    return `Usuario<${this.email}>`;
  }
}

const usuario = new Usuario('joel@utn.edu.ar', 'abc123');
console.log(usuario.toString());
console.log(`verificar('abc123') = ${usuario.verificar('abc123')}`); // true

// La diferencia se ve al compilar: 'private' se BORRA y en el .js la propiedad
// queda accesible como cualquier otra; '#' sigue siendo privada en ejecución.
console.log(`propiedades visibles en runtime: ${Object.keys(usuario).join(', ')}`); // email

// private protege del error propio; # protege el dato.

console.log();

// ============================================================================
// NIVEL 4: implements - la clase que cumple un contrato
// ============================================================================

console.log('=== NIVEL 4: implements ===\n');

interface ProductoData {
  id: number;
  nombre: string;
  precio: number;
}

type ProductoNuevo = Omit<ProductoData, 'id'>;

// El "puerto" de la arquitectura hexagonal, ahora explícito.
interface RepositorioProductos {
  findAll(): Promise<ProductoData[]>;
  guardar(datos: ProductoNuevo): Promise<ProductoData>;
}

// El "adaptador": hoy un array en memoria, mañana MikroORM. Mientras cumpla la
// interface, el resto de la aplicación no se entera del cambio.
class ProductosEnMemoria implements RepositorioProductos {
  private productos: ProductoData[] = [];

  async findAll(): Promise<ProductoData[]> {
    return this.productos;
  }

  async guardar(datos: ProductoNuevo): Promise<ProductoData> {
    const nuevo: ProductoData = { id: this.productos.length + 1, ...datos };
    this.productos.push(nuevo);
    return nuevo;
  }
}

// Si el método estuviera mal escrito (findall en minúscula, u otra firma), el
// error sería: "Class 'ProductosEnMemoria' incorrectly implements interface
// 'RepositorioProductos'". Ese es el mismo error que van a ver al escribir el
// primer repository de MikroORM.

const repo: RepositorioProductos = new ProductosEnMemoria();

await repo.guardar({ nombre: 'Auriculares', precio: 45000 });
await repo.guardar({ nombre: 'Webcam', precio: 60000 });

const todos = await repo.findAll();
console.log(`guardados: ${todos.map((p) => `#${p.id} ${p.nombre}`).join(' | ')}`);

console.log();

// ============================================================================
// NIVEL 5: Herencia con tipos
// ============================================================================

console.log('=== NIVEL 5: Herencia ===\n');

class ProductoDigital extends Producto {
  constructor(
    id: number,
    nombre: string,
    precio: number,
    public readonly urlDescarga: string
  ) {
    super(id, nombre, precio); // el compilador verifica los argumentos
  }

  // Sobrescribir un método: la firma tiene que seguir siendo compatible.
  precioFinal(): number {
    return super.precioFinal() * 0.9; // los digitales tienen 10% off siempre
  }
}

const ebook = new ProductoDigital(3, 'Curso de TypeScript', 50000, 'https://…');
console.log(`${ebook.nombre}: $${ebook.precioFinal()}`); // 45000
console.log(`descarga: ${ebook.urlDescarga}`);

console.log();

// ============================================================================
// RESUMEN
// ============================================================================

console.log('=== RESUMEN ===\n');
console.log('1. Las propiedades se declaran con su tipo antes de usarlas.');
console.log('2. public / private / readonly en el constructor declaran y asignan.');
console.log('3. private es de compilación; #privado es de ejecución.');
console.log('4. implements verifica que la clase cumpla el contrato de la interface.');
console.log('5. Sobre esto se construyen las entidades de MikroORM (próxima unidad).');
