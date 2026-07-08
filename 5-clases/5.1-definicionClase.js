class Persona {
  // Instance properties (también llamados Instance fields/attributes en POO tradicional)
  // contienen datos específicos de cada objeto
  edad = 0;
  email;

  // Constructor
  // método especial ejecutado al crear nuevas instancias de objetos
  constructor(nombre, apellido) {
    // Inicialización de propiedades dentro del constructor
    // permite asignar valores recibidos por parámetro
    this.nombre = nombre;
    this.apellido = apellido;
  }

  // Métodos de instancia
  // contienen código que puede operar sobre los instance properties
  obtenerNombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  saludar() {
    return `Hola, mi nombre es ${this.obtenerNombreCompleto()}, tengo ${this.edad} años.`;
  }

  // Getter
  // accessor para recuperar el valor de una property
  get nombreCompleto() {
    return this.obtenerNombreCompleto();
  }

  // Setter
  // accessor para establecer el valor de una property
  set nombreCompleto(nombreCompleto) {
    const partes = nombreCompleto.split(' ');
    this.nombre = partes[0];
    this.apellido = partes[1];
  }

  // Static method (también llamados métodos de clase)
  // contiene lógica perteneciente a la clase, no a cada objeto.
  static crearAnonima() {
    return new Persona('Juan', 'Pérez');
  }
}

const mirtha = new Persona('Mirtha', 'Legrand');
mirtha.edad = 189;

console.log(mirtha.saludar()); // Hola, mi nombre es Mirtha Legrand, tengo 189 años.
