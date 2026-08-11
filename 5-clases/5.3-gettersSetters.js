'use strict';
console.clear();

// ============================================================
// Getters y setters
// ============================================================
// Un GETTER (`get`) es un método que se usa como si fuera una
// propiedad: se lee SIN paréntesis. Sirve para valores derivados,
// que no se guardan sino que se calculan.
//
// Un SETTER (`set`) se ejecuta cuando alguien ASIGNA a esa
// propiedad. Su utilidad real es una sola: validar antes de guardar.

// ---------- El problema: sin setter, nadie protesta ----------

class ProductoSinValidar {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  get precioConIva() {
    return this.precio * 1.21;
  }
}

const malo = new ProductoSinValidar('Teclado', 25000);

console.log(malo.precioConIva); // 30250 (getter: SIN paréntesis)

malo.precio = 'muy caro'; // nadie protesta...
console.log(malo.precioConIva); // NaN  <- el error aparece lejos del problema

// ---------- La solución: setter con validación ----------

class Producto {
  #precio; // el dato real, privado (ver 5.4)

  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio; // pasa por el setter: valida también al crear
  }

  get precio() {
    return this.#precio;
  }

  set precio(valor) {
    if (typeof valor !== 'number' || valor <= 0) {
      throw new Error('El precio tiene que ser un número positivo');
    }
    this.#precio = valor;
  }

  get precioConIva() {
    return this.#precio * 1.21;
  }
}

const teclado = new Producto('Teclado', 25000);
console.log();
console.log(teclado.precio); // 25000
console.log(teclado.precioConIva); // 30250

try {
  teclado.precio = -5000;
} catch (error) {
  console.log(error.message); // El precio tiene que ser un número positivo
}

// El objeto no se puede ni siquiera CREAR en estado inválido:
try {
  new Producto('Roto', -1);
} catch (error) {
  console.log(error.message); // El precio tiene que ser un número positivo
}

// ============================================================
// El error clásico: el setter que se llama a sí mismo
// ============================================================
// Si el campo se llama IGUAL que el setter, la asignación de adentro
// vuelve a disparar el setter, infinitamente.
//
// class Roto {
//   set precio(valor) {
//     this.precio = valor;  // se llama a sí mismo
//   }
// }
// new Roto().precio = 10;
// RangeError: Maximum call stack size exceeded
//
// La solución es que el dato viva en OTRO nombre: `#precio`.
// Es el mismo tipo de error que la recursión sin caso base de 2.4.

// ============================================================
// ¿Getter o método?
// ============================================================
// GETTER: dato derivado, barato, sin efectos y sin parámetros.
// MÉTODO: hace algo (modifica, guarda, pide datos), recibe
//         parámetros, o es lento o asincrónico.
