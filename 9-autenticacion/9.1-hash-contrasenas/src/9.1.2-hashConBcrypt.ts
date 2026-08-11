// ============================================================================
// HASH CON BCRYPT: SALT Y COST FACTOR
// ============================================================================
// Correr con: npm run hash
//
// bcrypt es un algoritmo de hash DISEÑADO para contraseñas (1999, y sigue
// vigente). Resuelve los dos problemas que le quedaban a SHA-256 en el 9.1.1:
// el determinismo y la velocidad.
// ============================================================================

import bcrypt from 'bcryptjs';

console.clear();

const contrasena = 'messi10';

// ============================================================================
// NIVEL 1: el mismo password, dos hashes distintos
// ============================================================================

console.log('=== NIVEL 1: hash ===\n');

// El segundo argumento es el COST FACTOR. 10 es el default razonable de hoy.
const hash1 = await bcrypt.hash(contrasena, 10);
const hash2 = await bcrypt.hash(contrasena, 10);

console.log('hash 1:', hash1);
console.log('hash 2:', hash2);
console.log('¿iguales?', hash1 === hash2); // false

// La misma contraseña, dos veces, y salieron distintos. Con SHA-256 eso era
// imposible. Lo que cambió es que bcrypt genera un SALT aleatorio por hash.

// ============================================================================
// NIVEL 2: qué hay adentro del hash
// ============================================================================

console.log('\n=== NIVEL 2: anatomía ===\n');

// El "hash" de bcrypt no es solo el hash: es un string de 60 caracteres con
// cuatro partes separadas por $.
//
//   $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
//    │  │  └─────── salt (22) ────────┘└──────── hash (31) ───────┘
//    │  └─ cost factor: 10
//    └──── versión del algoritmo: 2b

const [, version, cost, resto] = hash1.split('$');

console.log('versión:    ', version); // 2b
console.log('cost factor:', cost); // 10
console.log('salt:       ', resto.slice(0, 22));
console.log('hash:       ', resto.slice(22));
console.log('largo total:', hash1.length, 'caracteres'); // 60

// Esto explica una duda que aparece sola: "si el salt es aleatorio, ¿dónde lo
// guardo para poder verificar después?". No lo guardás en ningún lado: viene
// DENTRO del string. Por eso la columna de la base es una sola, y por eso en
// la entidad del 9.3 es un varchar(60).
//
// Y no, que el salt sea público no lo rompe. El salt no es un secreto: su
// trabajo es que dos usuarios con la misma contraseña tengan hashes distintos
// y que no se puedan precalcular tablas de hashes (rainbow tables). Para eso
// alcanza con que sea único, no con que sea secreto.

// ============================================================================
// NIVEL 3: el cost factor es un dial
// ============================================================================

console.log('\n=== NIVEL 3: cuánto cuesta ===\n');

// El cost factor es EXPONENCIAL: cada +1 duplica el trabajo. Un cost de 10
// significa 2^10 = 1024 iteraciones internas.
for (const cost of [4, 8, 10, 12]) {
  const inicio = performance.now();
  await bcrypt.hash(contrasena, cost);
  const ms = performance.now() - inicio;

  console.log(`cost ${String(cost).padStart(2)} -> ${ms.toFixed(0).padStart(5)} ms`);
}

// cost  4 ->     2 ms
// cost  8 ->    25 ms
// cost 10 ->    95 ms
// cost 12 ->   380 ms
// (los números dependen de la máquina; lo que importa es que se duplican)

// Comparar con el 9.1.1: ahí probamos cinco candidatos en 0.05 ms. Con cost 10
// esos mismos cinco tardan medio segundo. Un diccionario de diez millones de
// entradas pasa de segundos a semanas.
//
// Y acá está la elegancia del diseño: el costo lo pagás UNA vez por login y el
// atacante lo paga en CADA intento. La asimetría es a tu favor.

// ============================================================================
// CÓMO SE ELIGE EL COST
// ============================================================================
// La regla práctica: el más alto que tu servidor tolere sin que el login se
// note lento. Hoy eso suele ser 10-12 (~100-400 ms).
//
// Como las máquinas se hacen más rápidas, el número correcto sube con los
// años. Por eso el cost va GUARDADO dentro del hash: si dentro de tres años
// subís de 10 a 13, los hashes viejos siguen verificándose con su cost 10, y
// podés re-hashear a cada usuario la próxima vez que haga login (el string
// dice con qué cost se generó).
//
// bcrypt tiene dos límites que conviene saber:
//   - Ignora todo lo que pase de 72 bytes. Con contraseñas normales no molesta.
//   - El salt es de 128 bits, suficiente para que no se repita nunca en la
//     práctica.
//
// Alternativas más nuevas y también correctas: scrypt y argon2, que además de
// tiempo exigen memoria. bcrypt sigue siendo una elección defendible y es el
// que más se encuentra en proyectos reales.
