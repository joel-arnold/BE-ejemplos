'use strict';
console.clear();

// ============================================================
// CALLBACKS (la idea básica)
// ============================================================
// Un callback es una función que le pasamos a otra función para
// que la llame "cuando corresponda". Es la base de la asincronía
// en JS: acá simulamos una demora con setTimeout y, recién cuando
// los datos "llegan", ejecutamos el callback con ese resultado.

function pedirDatos(callback) {
  setTimeout(() => {
    const datos = { id: 1, nombre: 'Ada' };
    callback(datos); // avisamos cuando "llegaron" los datos
  }, 1000);
}

pedirDatos((datos) => {
  console.log(`Llegaron los datos.
    Nombre: ${datos.nombre}
    ID: ${datos.id}`);
});