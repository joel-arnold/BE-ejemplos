'use strict';

// ============================================================
// Objetos como "moldes" con un método iniciar()
// ============================================================
// Otra forma de armar objetos e herencia SIN funciones
// constructoras ni `new`: usamos objetos comunes como molde y les
// agregamos un método `iniciar()` que carga las propiedades.
// - Con `Object.create(molde)` creamos una instancia cuyo prototipo
//   es el molde (así hereda sus métodos).
// - Después llamamos a `iniciar(...)` para inicializar sus datos.
// `Celebridad` a su vez tiene como prototipo a `Persona`, y su
// `iniciar()` reutiliza el del padre con Persona.iniciar.call(this...).

const Persona = {
  iniciar(nombre, apellido, edad) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.saludar = function () {
      return `Hola, soy ${this.nombre} ${this.apellido}`;
    };
  },
};

const Celebridad = {
  __proto__: Persona,
  iniciar(nombre, apellido, edad, frase) {
    Persona.iniciar.call(this, nombre, apellido, edad);
    this.frase = frase;
    this.decirFrase = function () {
      return `"${this.frase}". ${this.nombre} ${this.apellido}`;
    };
  },
};

const rosa = Object.create(Persona);
rosa.iniciar('Rosa', 'Martínez', 25);

const mirtha = Object.create(Celebridad);
mirtha.iniciar(
  'Mirtha',
  'Legrand',
  25,
  'Como te ven, te tratan.'
);

console.log(`${rosa.nombre} dice:\n${rosa.saludar()}`);
console.log();
console.log(`${mirtha.nombre} saluda:\n${mirtha.saludar()}\ny dice: ${mirtha.decirFrase()}`);
console.log();

console.log(`¿rosa.__proto__ es Persona? ${rosa.__proto__ === Persona}`);
console.log(`¿Persona.__proto__ es Object.prototype? ${Persona.__proto__ === Object.prototype}`);
console.log(`Persona.prototype: ${Persona.prototype}`);

console.log(`¿mirtha.__proto__ es Celebridad? ${mirtha.__proto__ === Celebridad}`);
console.log(`¿mirtha.__proto__.__proto__ es Persona? ${mirtha.__proto__.__proto__ === Persona}`);
console.log(`¿Celebridad.__proto__ es Persona? ${Celebridad.__proto__ === Persona}`);
