"use strict";
console.clear();

// ============================================================
// RECURSIÓN + declaración vs expresión
// ============================================================
// Una función RECURSIVA es la que se llama a sí misma. Acá, si le
// pasan un objeto {nombre, apellido}, arma un string y se vuelve a
// llamar para saludar. El archivo muestra la MISMA idea escrita de
// varias formas: declaración, expresión con nombre, expresión
// anónima y función flecha.
//
// OJO con las expresiones con nombre: el nombre interno (por ej.
// decirHolaExpresion2) solo es accesible DENTRO de la función.
// Desde afuera hay que usar la variable (saludarExpresion2); por
// eso la última línea comentada falla si se la descomenta.

// Declaración
function decirHolaDeclaracion(destinatario, saludo = "Hola") {
  if (typeof destinatario === "string") {
    return `${saludo} ${destinatario}`;
  } else if (typeof destinatario === "object") {
    return decirHolaDeclaracion(`${destinatario.nombre} ${destinatario.apellido}`, saludo);
  }
}

// Expresión
const saludarExpresion = function decirHolaExpresion(destinatario, saludo = "Hola") {
  if (typeof destinatario === "string") {
    return `${saludo} ${destinatario}`;
  } else if (typeof destinatario === "object") {
    return saludarExpresion(`${destinatario.nombre} ${destinatario.apellido}`, saludo);
  }
};

// Expresión
const saludarExpresion2 = function decirHolaExpresion2(destinatario, saludo = "Hola") {
  if (typeof destinatario === "string") {
    return `${saludo} ${destinatario}`;
  } else if (typeof destinatario === "object") {
    return decirHolaExpresion2(`${destinatario.nombre} ${destinatario.apellido}`, saludo);
  }
};

// Expresión de función anónima
const saludarExpresionAnonima = function (destinatario, saludo = "Hola") {
  if (typeof destinatario === "string") {
    return `${saludo} ${destinatario}`;
  } else if (typeof destinatario === "object") {
    return saludarExpresionAnonima(`${destinatario.nombre} ${destinatario.apellido}`, saludo);
  }
};

const saludarFuncionFlecha = (destinatario, saludo = "Hola") => {
  if (typeof destinatario === "string") {
    return `${saludo} ${destinatario}`;
  } else if (typeof destinatario === "object") {
    return saludarFuncionFlecha(`${destinatario.nombre} ${destinatario.apellido}`, saludo);
  }
};

const datos = {
  nombre: "Juan",
  apellido: "Gonzalez",
};

console.log(decirHolaDeclaracion(datos));
console.log(decirHolaDeclaracion({nombre: "Juan", apellido: "Gonzalez" })); // Declaración
console.log(saludarExpresion({ nombre: "Josué", apellido: "Gonzalez" })); // Expresión
console.log(saludarExpresion2({ nombre: "Joaquín", apellido: "Gonzalez" })); // Expresión
console.log(saludarExpresionAnonima({ nombre: "Juana", apellido: "Gonzalez" })); // Expresión de función anónima
console.log(saludarFuncionFlecha({ nombre: "Jésica", apellido: "Gonzalez" })); // Función flecha

// console.log(decirHolaExpresion2({ nombre: 'Falla', apellido: 'AlEjecutar' })); // descomentá para ver el error
