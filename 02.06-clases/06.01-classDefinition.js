class Person {
  // Instance properties (también llamados Instance fields/attributes en POO tradicional)
  // contienen datos específicos de cada objeto
  age = 0;
  email;

  // Constructor
  // método especial ejecutado al crear nuevas instancias de objetos
  constructor(firstName, lastName) {
    // Inicialización de propiedades dentro del constructor
    // permite asignar valores recibidos por parámetro
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // Métodos de instancia
  // contienen código que puede operar sobre los instance properties
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  greet() {
    return `Hola, mi nombre es ${this.getFullName()}, tengo ${this.age} años.`;
  }

  // Getter
  // accessor para recuperar el valor de una property
  get fullName() {
    return this.getFullName();
  }

  // Setter
  // accessor para establecer el valor de una property
  set fullName(name) {
    const parts = name.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  }

  // Static method (también llamados métodos de clase)
  // contiene lógica perteneciente a la clase, no a cada objeto.
  static createAnonymous() {
    return new Person('Juan', 'Pérez');
  }
}

const sam = new Person('Sam', 'Clemens');
sam.age = 189;

console.log(sam.greet()); // Hola, mi nombre es Sam Clemens, tengo 189 años.
