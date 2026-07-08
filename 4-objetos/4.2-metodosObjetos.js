'use strict';
console.clear();

// ============================================================
// Métodos de los objetos
// ============================================================
// Un método es una propiedad cuyo valor es una función. Dentro de
// un método, la palabra clave `this` apunta al objeto que lo llama,
// así que puede leer las demás propiedades de ese objeto (por
// ejemplo, calcular la edad a partir de la fecha de nacimiento).
// También se muestra:
// - el operador `in`, que dice si una propiedad existe en el objeto.
// - el operador `delete`, que elimina una propiedad del objeto.

const persona = {
  nombre: 'Rosa',
  apellido: 'Martínez',
  fechaNacimiento: new Date('1988-04-17'),
  calcularEdad() {
    return Math.floor((Date.now() - this.fechaNacimiento.getTime()) / 3.15576e10);
  },
  calcularEdadEnFecha(fecha) {
    return Math.floor((fecha.getTime() - this.fechaNacimiento.getTime()) / 3.15576e10);
  },
  pasatiempos: ['leer', 'surfear', 'programar'],
  direccion: {
    calle: 'Zeballos 1341',
    ciudad: {
      codigoPostal: 2000,
      nombre: 'Rosario',
    },
    provincia: {
      codigo: 63,
      nombre: 'Provincia de Santa Fe',
    },
    pais: 'Argentina',
    direccionCompleta() {
      return `${this.calle}, ${this.ciudad.nombre}, ${this.provincia.nombre}, ${this.pais}`;
    },
  },
};

console.log(persona.direccion.direccionCompleta());
console.log(persona.calcularEdad());
console.log(persona.calcularEdadEnFecha(new Date('2022-12-18')));
console.log('direccion' in persona);
delete persona.direccion;
console.log('direccion' in persona);
