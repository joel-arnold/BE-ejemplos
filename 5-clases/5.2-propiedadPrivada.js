// ============================================================
// Propiedades privadas en clases (campos con #)
// ============================================================
// Un campo cuyo nombre empieza con `#` es PRIVADO: solo se puede
// leer o escribir desde ADENTRO de la clase. Desde afuera del
// objeto no es accesible (intentarlo produce un error de sintaxis).
// Sirve para encapsular datos internos que no queremos exponer.
// Acá `#fechaNacimiento` es privada: se usa dentro del constructor
// para calcular la edad, pero no se puede consultar directamente
// desde afuera. Debe declararse antes del constructor.

class Persona {
  email;
  #fechaNacimiento; // Propiedad privada - debe ser declarada antes del constructor

  constructor(nombre, apellido, fechaNacimiento) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.#fechaNacimiento = fechaNacimiento;
    this.edad = Math.floor((Date.now() - new Date(fechaNacimiento).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  }

  obtenerNombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  saludar() {
    return `Hola, mi nombre es ${this.obtenerNombreCompleto()}, tengo ${this.edad} años.`;
  }

  get nombreCompleto() {
    return this.obtenerNombreCompleto();
  }

  set nombreCompleto(nombreCompleto) {
    const partes = nombreCompleto.split(' ');
    this.nombre = partes[0];
    this.apellido = partes[1];
  }

  static crearAnonima() {
    return new Persona('Juan', 'Pérez', '1990-01-01');
  }
}

const mirtha = new Persona('Mirtha', 'Legrand', '1927-02-23');
console.log(mirtha.edad); // edad calculada según la fecha actual
console.log(mirtha.saludar()); // Hola, mi nombre es Mirtha Legrand, tengo N años.
// console.log(mirtha.#fechaNacimiento); // descomentar para ver el error: no se puede acceder a propiedades privadas desde afuera
