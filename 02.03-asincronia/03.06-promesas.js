'use strict';
console.clear();

// ============================================================
// PROMESAS (Promises)
// ============================================================
// Una promesa es un objeto que representa el resultado (todavía
// no disponible) de una operación asíncrona. Puede estar en tres
// estados:
//   - pending   (pendiente): aún no terminó
//   - fulfilled (resuelta):  terminó bien   -> resolve(valor)
//   - rejected  (rechazada): terminó mal    -> reject(error)

// ------------------------------------------------------------
// 1) CREACIÓN de una promesa
// ------------------------------------------------------------
// El "executor" recibe dos funciones: resolve y reject.
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        // Algo salió mal: rechazamos la promesa
        reject(new Error("El id debe ser mayor a 0"));
        return;
      }
      // Todo bien: resolvemos con un valor
      resolve({ id: id, nombre: "Ana" });
    }, 1000);
  });
}

// ------------------------------------------------------------
// OJO: "resolve" y "reject" no son palabras reservadas
// ------------------------------------------------------------
// Son solo los NOMBRES que le pusimos a los dos parámetros del
// executor. Podríamos llamarlos como quisiéramos: lo que importa
// es el ORDEN. El 1er parámetro SIEMPRE resuelve (-> va al .then)
// y el 2do parámetro SIEMPRE rechaza (-> va al .catch).
function dividir(a, b) {
  // Acá, a propósito, los llamamos "ok" y "falla".
  return new Promise((ok, falla) => {
    if (b === 0) {
      falla(new Error("No se puede dividir por cero")); // 2do param -> .catch
      return;
    }
    ok(a / b); // 1er param -> .then
  });
}

dividir(10, 2)
  .then((resultado) => console.log("dividir(10, 2) ->", resultado)) // 5
  .catch((error) => console.log("dividir(10, 2) -> error:", error.message));

dividir(10, 0)
  .then((resultado) => console.log("dividir(10, 0) ->", resultado))
  .catch((error) => console.log("dividir(10, 0) -> error:", error.message));

// ------------------------------------------------------------
// 2) EJECUCIÓN / CONSUMO de una promesa
// ------------------------------------------------------------
// .then()    -> se ejecuta cuando la promesa se resuelve
// .catch()   -> se ejecuta cuando la promesa se rechaza
// .finally() -> se ejecuta siempre, haya salido bien o mal
obtenerUsuario(1)
  .then((usuario) => {
    console.log("Usuario obtenido:", usuario);
  })
  .catch((error) => {
    console.log("Ocurrió un error:", error.message);
  })
  .finally(() => {
    console.log("La operación finalizó (con o sin éxito)");
  });

// ------------------------------------------------------------
// 3) ENCADENAMIENTO (chaining)
// ------------------------------------------------------------
// Cada .then() devuelve una nueva promesa, así que podemos
// encadenar pasos de forma lineal (adiós al "callback hell").
function obtenerPublicaciones(usuario) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([`Post de ${usuario.nombre} #1`, `Post de ${usuario.nombre} #2`]);
    }, 1000);
  });
}

obtenerUsuario(2)
  .then((usuario) => obtenerPublicaciones(usuario)) // devolvemos otra promesa
  .then((publicaciones) => {
    console.log("Publicaciones:", publicaciones);
  })
  .catch((error) => {
    // Un solo catch atrapa el error de cualquier paso de la cadena
    console.log("Error en la cadena:", error.message);
  });

// ============================================================
// COMBINADORES DE PROMESAS
// ============================================================
// Sirven para trabajar con varias promesas al mismo tiempo.

// Promesas de ejemplo con distintos tiempos de respuesta
const pizza = new Promise((resolve) =>
  setTimeout(() => resolve("🍕 Pizza lista"), 1500)
);
const bebida = new Promise((resolve) =>
  setTimeout(() => resolve("🥤 Bebida lista"), 800)
);
const postre = new Promise((resolve) =>
  setTimeout(() => resolve("🍰 Postre listo"), 1200)
);

// ------------------------------------------------------------
// Promise.all() -> espera a que TODAS se resuelvan.
// Devuelve un array con los resultados, en el mismo orden.
// Si UNA sola se rechaza, all() se rechaza inmediatamente.
// ------------------------------------------------------------
Promise.all([pizza, bebida, postre])
  .then((pedido) => {
    console.log("Promise.all -> todo listo:", pedido);
  })
  .catch((error) => {
    console.log("Promise.all -> falló algo:", error.message);
  });

// ------------------------------------------------------------
// Promise.race() -> devuelve la PRIMERA que termine (se resuelva
// o se rechace). Útil, por ejemplo, para timeouts.
// ------------------------------------------------------------
Promise.race([pizza, bebida, postre]).then((primero) => {
  console.log("Promise.race -> el primero en llegar:", primero);
});

// ------------------------------------------------------------
// Promise.allSettled() -> espera a que TODAS terminen, sin
// importar si se resolvieron o rechazaron. Nunca se rechaza:
// devuelve un array describiendo el estado de cada una.
// ------------------------------------------------------------
const conError = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("La cocina se quedó sin ingredientes")), 500)
);

Promise.allSettled([pizza, conError])
  .then((resultados) => {
    console.log("Promise.allSettled -> resultados:");
    resultados.forEach((r) => console.log("  ", r));
    // Cada elemento es:
    //   { status: "fulfilled", value: ... }
    //   { status: "rejected",  reason: ... }
  });

// ------------------------------------------------------------
// Promise.any() -> devuelve la PRIMERA que se RESUELVA (ignora
// las que se rechazan). Si TODAS se rechazan, any() se rechaza
// con un AggregateError que junta todos los errores en .errors.
//
// Se parece a race(), pero:
//   - race() se queda con la primera que TERMINE (aunque falle).
//   - any()  se queda con la primera que tenga ÉXITO.
// ------------------------------------------------------------
const lento = new Promise((resolve) =>
  setTimeout(() => resolve("🐢 Llegué tarde, pero llegué"), 1000)
);
const falla = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("💥 Fallé enseguida")), 200)
);

Promise.any([falla, lento])
  .then((primeroConExito) => {
    // Ignora "falla" (rechazada) y toma "lento" (resuelta).
    console.log("Promise.any -> primero con éxito:", primeroConExito);
  })
  .catch((error) => {
    // Solo llega acá si TODAS se rechazan.
    console.log("Promise.any -> todas fallaron:", error.errors);
  });
