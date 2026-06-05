'use strict';

const sayHi = (name, greeting = 'Hola') => `${greeting} ${name}`;

const greetExpressionAnonymous = (recipient, greeting = 'Hola') => {
  if (typeof recipient === 'string') {
    return `${greeting} ${recipient}`;
  } else if (typeof recipient === 'object') {
    return greetExpressionAnonymous(`${recipient.firstName} ${recipient.lastName}`, greeting);
  }
};

console.log(sayHi('Juan', 'Buen día'));
console.log(greetExpressionAnonymous({ firstName: 'Juana', lastName: 'Pérez' }, 'Buen día'));
