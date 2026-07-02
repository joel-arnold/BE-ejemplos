'use strict';
console.clear();

// ============================================================
// async / await
// ============================================================
// async/await es "azúcar sintáctico" sobre las promesas (02.15):
// - una función async SIEMPRE devuelve una promesa.
// - await "pausa" la función hasta que la promesa termina y se
//   queda con su valor resuelto.
// El mismo flujo del callback hell (02.13) queda plano y legible,
// como si fuera código sincrónico. (Manejo de errores en 02.17.)
function obtenerUsuario(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Usuario obtenido");
      resolve({ id: id, nombre: "Ana" });
    }, 1000);
  });
}

function obtenerPublicaciones(usuario) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Publicaciones obtenidas");
      resolve(["Publicación 1", "Publicación 2"]);
    }, 1000);
  });
}

function obtenerComentarios(publicacion) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Comentarios obtenidos");
      resolve(["Comentario A", "Comentario B"]);
    }, 1000);
  });
}

function notificarUsuario(comentarios) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Usuario notificado");
      resolve("Notificación enviada");
    }, 1000);
  });
}

// Con async/await el mismo flujo queda lineal y legible
async function principal() {
  const usuario = await obtenerUsuario(1);
  const publicaciones = await obtenerPublicaciones(usuario);
  const comentarios = await obtenerComentarios(publicaciones[0]);
  const resultado = await notificarUsuario(comentarios);
  console.log(resultado);
}

principal();
