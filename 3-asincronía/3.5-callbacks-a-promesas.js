'use strict';
console.clear();

// ============================================================
// DE CALLBACKS A PROMESAS (promisify)
// ============================================================
// Mucho código viejo (y varias APIs de Node.js) usan el patrón
// de callback "error-first": callback(error, resultado). Para
// poder aprovechar .then()/.catch() y async/await, conviene
// "envolver" ese callback dentro de una Promise. A ese proceso
// se le dice promisificar.
//
// Este archivo es el puente entre los callbacks (3.2, 3.3 y
// 3.4) y las promesas (3.6).

// ------------------------------------------------------------
// 1) La función original, basada en callback "error-first"
// ------------------------------------------------------------
// Convención: el primer parámetro del callback es el error
// (o null si salió todo bien) y el segundo es el resultado.
function obtenerUsuarioCallback(id, callback) {
  setTimeout(() => {
    if (id <= 0) {
      callback(new Error("El id debe ser mayor a 0"));
      return;
    }
    callback(null, { id: id, nombre: "Ana" });
  }, 1000);
}

// ------------------------------------------------------------
// 2) La versión promisificada
// ------------------------------------------------------------
// Envolvemos la llamada al callback dentro de una Promise:
//   - si llega un error -> reject
//   - si llega el dato  -> resolve
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    obtenerUsuarioCallback(id, (error, usuario) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(usuario);
    });
  });
}

// ------------------------------------------------------------
// 3) Ahora sí: ya podemos usar .then()/.catch() o async/await
// ------------------------------------------------------------
obtenerUsuario(1)
  .then((usuario) => console.log(".then  -> usuario:", usuario))
  .catch((error) => console.log(".then  -> error:", error.message));

(async () => {
  try {
    const usuario = await obtenerUsuario(2);
    console.log("await -> usuario:", usuario);
  } catch (error) {
    console.log("await -> error:", error.message);
  }
})();

// ------------------------------------------------------------
// Nota: en Node.js existe util.promisify(), que hace exactamente
// esto de forma automática para cualquier función con callback
// error-first:
//
//   const { promisify } = require("util");
//   const obtenerUsuario = promisify(obtenerUsuarioCallback);
// ------------------------------------------------------------
