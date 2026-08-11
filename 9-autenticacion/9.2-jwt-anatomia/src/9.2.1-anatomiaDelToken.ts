// ============================================================================
// QUÉ ES UN JWT POR DENTRO
// ============================================================================
// Correr con: npm run anatomia
//
// El problema que resuelve: HTTP NO TIENE MEMORIA. Cada request llega solo, sin
// ninguna relación con el anterior. El servidor autenticó a Ana en el POST
// /login... y en el siguiente request no tiene idea de quién es.
//
// Un JWT es la forma de que el cliente traiga esa prueba en cada request.
// ============================================================================

import jwt from 'jsonwebtoken';

console.clear();

const SECRET = 'un-secreto-largo-que-en-el-9.3-va-a-vivir-en-el-.env';

// ============================================================================
// NIVEL 1: emitir un token
// ============================================================================

console.log('=== NIVEL 1: sign ===\n');

const token = jwt.sign(
  // El PAYLOAD: lo que el servidor quiere recordar de este usuario.
  { sub: '1', email: 'ana@dsw.com', rol: 'usuario' },
  SECRET,
  { expiresIn: '1h' },
);

console.log(token);
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOi...

// ============================================================================
// NIVEL 2: las tres partes
// ============================================================================

console.log('\n=== NIVEL 2: las tres partes ===\n');

const [header, payload, firma] = token.split('.');

console.log('header:  ', header);
console.log('payload: ', payload);
console.log('firma:   ', firma);

// Las dos primeras son JSON en base64url. Y base64 NO es encriptación: es una
// forma de escribir bytes con caracteres seguros para una URL. Se deshace sin
// ninguna clave, con una línea:
const decodificar = (parte: string) => JSON.parse(Buffer.from(parte, 'base64url').toString());

console.log('\nheader decodificado: ', decodificar(header));
// { alg: 'HS256', typ: 'JWT' }

console.log('payload decodificado:', decodificar(payload));
// { sub: '1', email: 'ana@dsw.com', rol: 'usuario', iat: ..., exp: ... }

// ============================================================================
// LA CONSECUENCIA MÁS IMPORTANTE DE TODA LA UNIDAD
// ============================================================================
// Acabamos de leer el payload SIN EL SECRET. Cualquiera que tenga el token
// puede hacerlo: el navegador del usuario, una extensión, alguien mirando la
// pestaña de Network, jwt.io.
//
// Por lo tanto:
//
//   NUNCA se pone en el payload nada que no pueda ser público.
//   Ni la contraseña, ni su hash, ni el DNI, ni el número de tarjeta.
//
// Lo que sí va: el id del usuario, el rol, la expiración. Cosas que el propio
// usuario ya sabe de sí mismo.
//
// Un JWT NO es secreto. Es AUTÉNTICO: no se puede FALSIFICAR sin el secret,
// que es otra cosa. Eso lo muestra el 9.2.2.
// ============================================================================

console.log('\n=== NIVEL 3: la firma ===\n');

// La tercera parte es la firma, y no es JSON. Es el resultado de:
//
//   HMAC-SHA256( base64url(header) + "." + base64url(payload), SECRET )
//
// Es decir: un hash de las dos primeras partes, mezclado con el secret. Quien
// no tiene el secret no puede calcularla.
console.log('la firma NO es JSON:', Buffer.from(firma, 'base64url').length, 'bytes crudos');
console.log('alg del header:     ', decodificar(header).alg, '← HMAC con SHA-256');

// ============================================================================
// NIVEL 4: decode NO valida
// ============================================================================

console.log('\n=== NIVEL 4: decode vs verify ===\n');

// jwt.decode() hace lo mismo que hicimos a mano: parsea y devuelve. NO chequea
// la firma ni la expiración.
console.log('decode:', jwt.decode(token));

// jwt.verify() recalcula la firma con el secret y revisa exp. Si algo no da,
// lanza. Es el único que sirve para decidir si confiar.
console.log('verify:', jwt.verify(token, SECRET));

// REGLA: en el servidor, decode() nunca. Siempre verify().
// decode() sirve del lado del cliente, para mostrar el nombre del usuario en
// la barra de navegación sin pedirlo de nuevo. Ahí no se está decidiendo nada.

// ============================================================================
// RESUMEN
// ============================================================================
//   header.payload.firma
//     │       │      └─ HMAC(header.payload, SECRET) — lo único que no se puede falsificar
//     │       └──────── JSON en base64url — CUALQUIERA lo lee
//     └──────────────── JSON en base64url — algoritmo y tipo
//
// Pegar el token en https://jwt.io muestra exactamente esto. Vale hacerlo una
// vez para convencerse de que el payload se lee sin nada.
