'use strict';
console.clear();

// Ejemplo de ejecución asíncrona con async/await
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
