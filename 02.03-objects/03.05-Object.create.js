const sam = {
  firstName: 'Sam',
  lastName: 'Clemens',
  age: 25,
  greet() {
    return `Hola, soy ${this.firstName} ${this.lastName}`;
  },
};

const mark = Object.create(sam, {
  firstName: { value: 'Mark' },
  lastName: { value: 'Twain' },
});

console.log(`${sam.firstName} dice:\n${sam.greet()}`);
console.log(`${mark.firstName} dice:\n${mark.greet()}`);
console.log();

console.log(`el prototipo de mark es: ${JSON.stringify(mark.__proto__)}`);

console.log(sam == mark.__proto__);

console.log(`el prototipo del prototipo de mark es: ${JSON.stringify(mark.__proto__.__proto__)}`);

console.log(
  `el prototipo del prototipo del prototipo del literal es: ${JSON.stringify(mark.__proto__.__proto__.__proto__)}`
);

const nonLiteralSam = Object.create(
  {},
  {
    firstName: { value: 'Sam no-literal' },
    lastName: { value: 'Clemens' },
    age: { value: 25 },
    greet: {
      value: function () {
        return `Hola, soy ${this.firstName} ${this.lastName}`;
      },
    },
  }
);

console.log(`${nonLiteralSam.firstName} dice:\n${nonLiteralSam.greet()}`);
