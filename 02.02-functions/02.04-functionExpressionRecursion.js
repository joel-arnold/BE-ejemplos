'use strict';

// Declaración
function sayHiDeclaration(recipient, greeting = 'Hola') {
  if (typeof recipient === 'string') {
    return `${greeting} ${recipient}`;
  } else if (typeof recipient === 'object') {
    return sayHiDeclaration(`${recipient.firstName} ${recipient.lastName}`, greeting);
  }
}

// Expresión
const greetExpression = function sayHiExpression(recipient, greeting = 'Hola') {
  if (typeof recipient === 'string') {
    return `${greeting} ${recipient}`;
  } else if (typeof recipient === 'object') {
    return greetExpression(`${recipient.firstName} ${recipient.lastName}`, greeting);
  }
};

// Expresión
const greetExpression2 = function sayHiExpression2(recipient, greeting = 'Hola') {
  if (typeof recipient === 'string') {
    return `${greeting} ${recipient}`;
  } else if (typeof recipient === 'object') {
    return sayHiExpression2(`${recipient.firstName} ${recipient.lastName}`, greeting);
  }
};

// Expresión de función anónima
const greetExpressionAnonymous = function (recipient, greeting = 'Hola') {
  if (typeof recipient === 'string') {
    return `${greeting} ${recipient}`;
  } else if (typeof recipient === 'object') {
    return greetExpressionAnonymous(`${recipient.firstName} ${recipient.lastName}`, greeting);
  }
};

const greetArrowFunction = (recipient, greeting = 'Hola') => {
  if (typeof recipient === 'string') {
    return `${greeting} ${recipient}`;
  } else if (typeof recipient === 'object') {
    return greetArrowFunction(`${recipient.firstName} ${recipient.lastName}`, greeting);
  }
};

console.log(sayHiDeclaration({ firstName: 'Juan', lastName: 'Pérez' })); // Declaración
console.log(greetExpression({ firstName: 'Josué', lastName: 'Pérez' })); // Expresión
console.log(greetExpression2({ firstName: 'Joaquín', lastName: 'Pérez' })); // Expresión
console.log(greetExpressionAnonymous({ firstName: 'Juana', lastName: 'Pérez' })); // Expresión de función anónima
console.log(greetArrowFunction({ firstName: 'Jésica', lastName: 'Pérez' })); // Arrow function

// console.log(sayHiExpression2({ firstName: 'Falla', lastName: 'AlEjecutar' })); // descomentar para ver el error
