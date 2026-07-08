// ============================================================
// const : declarar variables que NO se pueden reasignar
// ============================================================
// Con `const` la variable debe inicializarse al declararla y no
// se puede volver a asignar (apunta siempre al mismo valor).
// OJO: si el valor es un objeto, la referencia queda fija, pero
// el contenido del objeto SÍ se puede modificar (mutar): podemos
// cambiar sus propiedades, aunque no reemplazar el objeto entero.

const persona = { nombre: 'Juan' };
console.log(persona);
persona.nombre = 'Juan Pérez'; // permitido: mutamos una propiedad
console.log(persona);
// persona = { nombre: 'Juan Pérez' }; // descomentar para ver el error: no se puede reasignar una const
