'use strict';
console.clear();

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