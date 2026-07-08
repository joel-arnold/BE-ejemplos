// ============================================================
// let : declarar variables que pueden cambiar de valor
// ============================================================
// Con `let` declaramos una variable y podemos reasignarla las
// veces que queramos. Se puede declarar sin valor inicial (queda
// como `undefined`) y asignarle un valor más tarde.
// `let` tiene alcance (scope) de bloque: la variable solo "vive"
// dentro de las llaves { } donde se declaró.

let mensaje;                      // declarada sin valor -> undefined
let despedida = 'hasta luego...';
mensaje = 'hola mundo';           // recién acá le asignamos un valor
console.log(mensaje);
console.log(despedida);
despedida = '...nos vemos';       // con `let` sí podemos reasignar
console.log(despedida);
