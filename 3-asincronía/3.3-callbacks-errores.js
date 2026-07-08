'use strict';
console.clear();

// ============================================================
// MANEJO DE ERRORES con callbacks
// ============================================================
// Una función asíncrona basada en callbacks también puede fallar.
// ¿Cómo le avisamos al que llamó que algo salió mal? Con una
// CONVENCIÓN muy usada en Node.js: el patrón "error-first".

// ------------------------------------------------------------
// 1) La convención "error-first"
// ------------------------------------------------------------
// El callback recibe el error como PRIMER parámetro:
//   - si algo falló -> callback(error)
//   - si salió bien -> callback(null, resultado)
// Quien lo usa revisa siempre primero si vino un error.
function obtenerUsuario(id, callback) {
  setTimeout(() => {
    if (id <= 0) {
      callback(new Error("El id debe ser mayor a 0")); // primero el error
      return;
    }
    callback(null, { id: id, nombre: "Ana" }); // null = "no hubo error"
  }, 1000);
}

obtenerUsuario(1, (error, usuario) => {
  if (error) {
    console.log("error-first -> falló:", error.message);
    return;
  }
  console.log("error-first -> ok:", usuario);
});

obtenerUsuario(-5, (error, usuario) => {
  if (error) {
    console.log("error-first -> falló:", error.message);
    return;
  }
  console.log("error-first -> ok:", usuario);
});

// ------------------------------------------------------------
// 2) OJO: "callback" y "error-first" son solo CONVENCIONES
// ------------------------------------------------------------
// Nada obliga a llamar "callback" al parámetro, ni a poner el
// error primero. Es una función común y corriente que pasamos
// como argumento. Acá va la MISMA idea, pero:
//   - los parámetros se llaman "alTerminar" y "alFallar"
//     (no "callback"),
//   - no hay ningún "error primero": usamos dos funciones
//     separadas, una para el éxito y otra para el error.
function obtenerProducto(id, alTerminar, alFallar) {
  setTimeout(() => {
    if (id <= 0) {
      alFallar(new Error("El id debe ser mayor a 0"));
      return;
    }
    alTerminar({ id: id, nombre: "Teclado" });
  }, 1000);
}

obtenerProducto(
  1,
  (producto) => console.log("dos funciones -> ok:", producto),
  (error) => console.log("dos funciones -> falló:", error.message)
);

obtenerProducto(
  -5,
  (producto) => console.log("dos funciones -> ok:", producto),
  (error) => console.log("dos funciones -> falló:", error.message)
);

// El "error-first" es la convención dominante (y la que espera,
// por ejemplo, util.promisify de Node), pero conviene entender
// que es una CONVENCIÓN, no una regla del lenguaje.
