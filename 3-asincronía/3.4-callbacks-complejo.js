'use strict';
console.clear();

// ============================================================
// CALLBACK HELL (callbacks anidados)
// ============================================================
// Cuando cada tarea asíncrona depende del resultado de la anterior
// y todo se resuelve con callbacks, terminamos anidando función
// dentro de función. El código crece "hacia la derecha", se vuelve
// difícil de leer y de manejar errores. A esto se lo llama
// "callback hell". Las promesas (3.6) y async/await (3.7)
// nacen justamente para resolver esto.
function obtenerUsuario(id, callback) {
  setTimeout(() => {
    console.log("Usuario obtenido");
    callback({ id: id, nombre: "Ana" });
  }, 1000);
}

function obtenerPublicaciones(usuario, callback) {
  setTimeout(() => {
    console.log("Publicaciones obtenidas");
    callback(["Publicación 1", "Publicación 2"]);
  }, 1000);
}

function obtenerComentarios(publicacion, callback) {
  setTimeout(() => {
    console.log("Comentarios obtenidos");
    callback(["Comentario A", "Comentario B"]);
  }, 1000);
}

function notificarUsuario(comentarios, callback) {
  setTimeout(() => {
    console.log("Usuario notificado");
    callback("Notificación enviada");
  }, 1000);
}

// Acá empieza el infierno 🔥
obtenerUsuario(1, function (usuario) {
  obtenerPublicaciones(usuario, function (publicaciones) {
    obtenerComentarios(publicaciones[0], function (comentarios) {
      notificarUsuario(comentarios, function (resultado) {
        console.log(resultado);
        // y si necesitás hacer algo más después, seguís anidando...
      });
    });
  });
});