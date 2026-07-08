'use strict';
console.clear();

// ============================================================
// Propiedades de los objetos
// ============================================================
// Un objeto es una colección de pares clave: valor (sus
// propiedades). Los valores pueden ser de cualquier tipo, incluso
// otros objetos (objetos anidados). Para acceder a una propiedad
// hay dos notaciones equivalentes:
// - de punto:     persona.nombre
// - de corchetes: persona['nombre']  (útil cuando la clave está
//   en una variable o tiene caracteres especiales).
// Además, a un objeto se le pueden agregar propiedades nuevas en
// cualquier momento, simplemente asignándolas.

const persona = {
  nombre: 'Rosa',
  apellido: 'Martínez',
  edad: 30,
  pasatiempos: ['leer', 'surfear', 'programar'],
  direccion: {
    calle: 'Calle Falsa 123',
    ciudad: {
      codigoPostal: 2000,
      nombre: 'Rosario',
    },
    provincia: {
      codigo: 21,
      nombre: 'Provincia de Santa Fe',
    },
    pais: 'Argentina',
  },
};

console.log('notación de punto');
console.log(`${persona.nombre} vive en ${persona.direccion.ciudad.nombre} y tiene ${persona.edad} años`);

console.log('cambiar edad');
persona.edad = 31;
console.log(`${persona.nombre} vive en ${persona.direccion.ciudad.nombre} y tiene ${persona.edad} años`);

console.log('notación de corchetes');
persona['edad'] = 40;
console.log(`${persona['nombre']} vive en ${persona['direccion']['ciudad']['nombre']} y tiene ${persona['edad']} años`);

console.log('crear propiedades');
persona.profesion = 'programadora web';
console.log(
  `${persona['nombre']} vive en ${persona['direccion']['ciudad']['nombre']}, tiene ${persona['edad']} años y trabaja como ${persona.profesion}`
);
