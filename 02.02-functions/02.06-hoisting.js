'use strict';
console.clear();

hoisting('esto es hoisting');
// noHoisting('esto no es hoisting'); // descomentar para ver el error

function hoisting(printText) {
  console.log(printText);
}

const noHoisting = function (printText) {
  console.log(printText);
};
