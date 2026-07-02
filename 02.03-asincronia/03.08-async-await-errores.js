'use strict';
console.clear();

// ============================================================
// MANEJO DE ERRORES con async/await
// ============================================================
// Con .then()/.catch() los errores de una promesa se atrapan
// con .catch(). Con async/await volvemos al clásico
// try/catch/finally, igual que en el código sincrónico.
// Esa es una de las ventajas: el manejo de errores vuelve a ser
// familiar y lineal.

// Esta función se resuelve o se rechaza según el id.
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        reject(new Error("El id debe ser mayor a 0"));
        return;
      }
      resolve({ id: id, nombre: "Ana" });
    }, 1000);
  });
}

// ------------------------------------------------------------
// try / catch / finally
// ------------------------------------------------------------
// - try:     código que puede fallar (los await van acá dentro).
// - catch:   se ejecuta si CUALQUIER await se rechaza (reject).
// - finally: se ejecuta siempre, haya salido bien o mal.
async function mostrarUsuario(id) {
  try {
    const usuario = await obtenerUsuario(id);
    console.log("Usuario obtenido:", usuario);
  } catch (error) {
    // El reject(new Error(...)) "cae" acá como si fuera un throw.
    console.log("Ocurrió un error:", error.message);
  } finally {
    console.log("La operación finalizó (con o sin éxito)");
  }
}

// ------------------------------------------------------------
// Propagación: si una función async NO atrapa el error, la
// promesa que devuelve queda RECHAZADA. El que la llama puede
// atraparla con su propio try/catch (o con .catch()).
// ------------------------------------------------------------
async function obtenerNombre(id) {
  // Sin try/catch: si obtenerUsuario se rechaza, el error se
  // propaga hacia quien llame a obtenerNombre.
  const usuario = await obtenerUsuario(id);
  return usuario.nombre;
}

// Corremos los casos en orden para que la salida no se mezcle.
(async () => {
  // Caso feliz: id válido -> entra por el try.
  await mostrarUsuario(1);

  // Caso con error: id inválido -> entra por el catch.
  await mostrarUsuario(-5);

  // Error propagado y atrapado por quien llama.
  try {
    const nombre = await obtenerNombre(-1);
    console.log("Nombre:", nombre);
  } catch (error) {
    console.log("Error propagado y atrapado afuera:", error.message);
  }
})();
