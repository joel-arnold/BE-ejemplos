'use strict';
console.clear();

// Ejemplo de ejecución asíncrona con callbacks anidados (callback hell)
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