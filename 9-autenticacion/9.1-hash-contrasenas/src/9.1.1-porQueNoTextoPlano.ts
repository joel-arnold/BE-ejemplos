// ============================================================================
// POR QUÉ UNA CONTRASEÑA NO SE GUARDA COMO VIENE
// ============================================================================
// Correr con: npm run plano
//
// Todavía sin bcrypt. Este archivo recorre las tres ideas malas en orden de
// menos mala a más mala, para que la buena (la del 9.1.2) se entienda como
// respuesta a un problema concreto y no como una receta.
// ============================================================================

import { createHash, scryptSync, createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

console.clear();

const contrasena = 'messi10';

// ============================================================================
// IDEA MALA 1: guardarla tal cual
// ============================================================================

console.log('=== IDEA MALA 1: texto plano ===\n');

const usuarioEnLaBase = { email: 'ana@dsw.com', password: contrasena };

console.log('fila en la base:', usuarioEnLaBase);
// { email: 'ana@dsw.com', password: 'messi10' }

// El problema no es teórico. Cualquiera que vea esa fila sabe la contraseña:
// el que administra la base, el que hace un backup, el que se filtra un dump,
// y vos mismo mirando un SELECT en clase.
//
// Y hay un daño extra que no es de tu sistema: la gente REUSA contraseñas. Si
// esta es la misma del mail, filtrar tu tabla de usuarios le abre el mail a
// todos ellos. Por eso "total, es solo un TP" no alcanza como argumento.

// ============================================================================
// IDEA MALA 2: cifrarla
// ============================================================================

console.log('\n=== IDEA MALA 2: cifrado (reversible) ===\n');

// Cifrar suena mejor: el que mira la base ve un chorizo ilegible.
const clave = scryptSync('la-clave-del-sistema', 'sal-fija', 32);
const iv = randomBytes(16);

const cipher = createCipheriv('aes-256-cbc', clave, iv);
const cifrada = cipher.update(contrasena, 'utf8', 'hex') + cipher.final('hex');

console.log('guardado:', cifrada);

// Pero cifrar es una operación de IDA Y VUELTA. Si el sistema puede cifrar,
// también puede descifrar — y la clave para hacerlo está en el mismo servidor
// que la base.
const decipher = createDecipheriv('aes-256-cbc', clave, iv);
const recuperada = decipher.update(cifrada, 'hex', 'utf8') + decipher.final('utf8');

console.log('descifrado:', recuperada); // messi10

// Ahí está el punto: volvimos a la contraseña original. Un atacante que se
// lleva la base normalmente se lleva también el código y la configuración.
//
// LA REGLA: para contraseñas no querés cifrado, querés algo que NO se pueda
// deshacer. Ni siquiera vos tenés que poder recuperarla. Por eso los sistemas
// serios ofrecen "restablecer contraseña" y nunca "recordar mi contraseña":
// no la tienen.

// ============================================================================
// IDEA MALA 3: hashear con un hash rápido
// ============================================================================

console.log('\n=== IDEA MALA 3: SHA-256 pelado ===\n');

// Un hash SÍ es de una sola dirección: de la contraseña se llega al hash, del
// hash no se vuelve. Vamos bien.
const sha = (texto: string) => createHash('sha256').update(texto).digest('hex');

console.log('sha256("messi10"):', sha(contrasena));

// Primer problema: es DETERMINÍSTICO. La misma entrada da siempre la misma
// salida, así que dos usuarios con la misma contraseña tienen el mismo hash.
console.log('sha256("messi10"):', sha('messi10'), '← idéntico');

// Eso permite mirar una tabla de hashes y sacar conclusiones sin descifrar
// nada: "estos catorce usuarios tienen todos la misma contraseña, debe ser
// 123456".

// Segundo problema, el grave: es RÁPIDO. Está diseñado para serlo — se usa
// para verificar archivos de gigabytes.
const diccionario = ['123456', 'password', 'messi10', 'qwerty', 'boca123'];
const objetivo = sha(contrasena);

const inicio = performance.now();
let intentos = 0;

// Un ataque de diccionario es exactamente esto, con millones de candidatos en
// vez de cinco:
for (const candidato of diccionario) {
  intentos++;
  if (sha(candidato) === objetivo) {
    console.log(`\nencontrada: "${candidato}" en ${intentos} intentos`);
    break;
  }
}

console.log(`tiempo: ${(performance.now() - inicio).toFixed(3)} ms`);
// tiempo: ~0.05 ms

// Cinco intentos en una fracción de milisegundo. Una placa de video común hace
// miles de millones de SHA-256 por segundo: cualquier contraseña que esté en
// una lista de filtraciones cae enseguida, y las listas tienen cientos de
// millones de entradas.
//
// Ojo con el matiz: el hash no se "rompió". Nadie invirtió SHA-256. Lo que se
// hizo fue PROBAR candidatos, que es mucho más barato de lo que parece.

// ============================================================================
// LO QUE HACE FALTA
// ============================================================================
// De las tres ideas, la tercera es la única que va en la dirección correcta.
// Le faltan dos cosas, y las dos las resuelve bcrypt en el 9.1.2:
//
//   1. Que el mismo password NO dé siempre el mismo hash  -> salt
//   2. Que calcularlo sea LENTO a propósito, y regulable  -> cost factor
//
// "Lento a propósito" suena a error de diseño y es justo al revés: 200 ms por
// login no los nota nadie, y multiplican por millones el costo de probar un
// diccionario entero.
