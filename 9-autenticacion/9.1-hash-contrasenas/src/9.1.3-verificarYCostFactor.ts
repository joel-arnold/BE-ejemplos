// ============================================================================
// VERIFICAR UNA CONTRASEÑA (Y LOS ERRORES CLÁSICOS DEL LOGIN)
// ============================================================================
// Correr con: npm run verificar
//
// Hashear es la mitad. La otra mitad es el login: llega un password en el body
// y hay que decidir si es el de ese usuario, sin poder deshacer el hash.
// ============================================================================

import bcrypt from 'bcryptjs';

console.clear();

// ============================================================================
// NIVEL 1: compare
// ============================================================================

console.log('=== NIVEL 1: compare ===\n');

// Simulamos la fila que quedó guardada en el registro.
const hashGuardado = await bcrypt.hash('messi10', 10);

// bcrypt.compare vuelve a hashear el candidato USANDO EL SALT que viene dentro
// del hash guardado, y compara los resultados. Nunca "desencripta" nada.
console.log('messi10 :', await bcrypt.compare('messi10', hashGuardado)); // true
console.log('Messi10 :', await bcrypt.compare('Messi10', hashGuardado)); // false
console.log('messi11 :', await bcrypt.compare('messi11', hashGuardado)); // false

// Un error que se ve seguido: comparar con === contra un hash nuevo.
const otroHash = await bcrypt.hash('messi10', 10);
console.log('\ncon === :', hashGuardado === otroHash, '← siempre false, el salt es distinto');

// La única forma de verificar es compare(). No hay atajo.

// ============================================================================
// NIVEL 2: el mensaje de error del login
// ============================================================================

console.log('\n=== NIVEL 2: qué contestar cuando falla ===\n');

const usuarios = [{ email: 'ana@dsw.com', passwordHash: hashGuardado }];

// ── Versión ingenua: mensajes distintos según qué falló ──
async function loginIngenuo(email: string, password: string): Promise<string> {
  const usuario = usuarios.find((u) => u.email === email);

  if (!usuario) return 'No existe ningún usuario con ese email';
  if (!(await bcrypt.compare(password, usuario.passwordHash))) return 'Contraseña incorrecta';

  return 'OK';
}

console.log('ingenuo, email inexistente:', await loginIngenuo('juan@dsw.com', 'loquesea'));
console.log('ingenuo, password errónea: ', await loginIngenuo('ana@dsw.com', 'nope'));

// Los dos mensajes son distintos, y esa diferencia es información gratis para
// un atacante: le permite averiguar QUÉ EMAILS están registrados sin saber
// ninguna contraseña. Eso se llama enumeración de usuarios.

// ── Versión correcta: un solo mensaje para los dos casos ──
async function login(email: string, password: string): Promise<string> {
  const usuario = usuarios.find((u) => u.email === email);

  // Ojo con el atajo: si el usuario no existe y devolvemos ya mismo, la
  // respuesta llega mucho más rápido que cuando sí existe (porque no corrió
  // bcrypt). El tiempo de respuesta filtra lo mismo que el mensaje.
  //
  // Por eso se compara igual, contra un hash descartable, para que las dos
  // ramas tarden parecido.
  const hashAComparar = usuario?.passwordHash ?? '$2b$10$invalidoinvalidoinvalidoinvalidoinvalidoinvalidoinvalidoin';
  const coincide = await bcrypt.compare(password, hashAComparar);

  if (!usuario || !coincide) return 'Credenciales inválidas';

  return 'OK';
}

console.log('\ncorrecto, email inexistente:', await login('juan@dsw.com', 'loquesea'));
console.log('correcto, password errónea: ', await login('ana@dsw.com', 'nope'));
console.log('correcto, credenciales ok:  ', await login('ana@dsw.com', 'messi10'));

// Los tres primeros casos contestan lo mismo. Desde afuera no se distingue si
// falló el email o la contraseña, y eso es exactamente lo que se busca.

// ============================================================================
// NIVEL 3: subir el cost sin romper lo viejo
// ============================================================================

console.log('\n=== NIVEL 3: rehash ===\n');

// Un hash viejo, generado hace años con cost 8.
const hashViejo = await bcrypt.hash('messi10', 8);
const COST_ACTUAL = 12;

console.log('hash viejo, cost:', hashViejo.split('$')[2]);

// Verifica igual: el cost con el que se generó viene adentro del string.
console.log('¿verifica?      ', await bcrypt.compare('messi10', hashViejo)); // true

// Y como en el login tenemos el password en texto plano por única vez, es el
// momento exacto para regenerarlo con el cost de hoy.
const costDelHash = Number(hashViejo.split('$')[2]);

if (costDelHash < COST_ACTUAL) {
  const hashNuevo = await bcrypt.hash('messi10', COST_ACTUAL);
  console.log('rehasheado a:   ', hashNuevo.split('$')[2]);
  // En un sistema real, acá va el UPDATE del usuario.
}

// ============================================================================
// RESUMEN
// ============================================================================
// hash(password, cost)      -> string de 60 chars con versión, cost, salt y hash
// compare(candidato, hash)  -> boolean. La ÚNICA forma de verificar
//
// Tres reglas que salen de acá y que valen para cualquier login:
//   1. Nunca compares hashes con ===. El salt hace que nunca coincidan.
//   2. Un solo mensaje de error ("Credenciales inválidas") y tiempos parecidos
//      en las dos ramas.
//   3. El password en texto plano existe solo dentro de la función que lo
//      recibe. No se loguea, no se guarda, no se manda a ningún lado.
//
// La 3 es la que más se rompe sin querer: un console.log(req.body) en el
// controller de login deja la contraseña escrita en los logs del servidor.
